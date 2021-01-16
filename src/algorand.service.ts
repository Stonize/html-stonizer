import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AlgorandAccountDto } from './dto/algorand-account.dto';

const puppeteer = require('puppeteer');
const algosdk = require('algosdk');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const dotenv = require('dotenv');
dotenv.config()

const TOKEN_URL = "https://stonize.com"
const TOKEN_UNIT_NAME = "SDEBT"
const TOKEN_ASSET_NAME = "Stonize-Debt"

@Injectable()
export class AlgorandService {

    private readonly algoClient

    constructor() {
        this.algoClient = new algosdk.Algod(process.env.ALGO_TOKEN, process.env.ALGO_SERVER, process.env.ALGO_PORT);
    }

    async getAccountInformation(address: string) {
        return await this.algoClient.accountInformation(address);
    }

    /**
     * Wait that a pending transaction is accepted or not
     * Notice that this method can get the status of a early submitted
     * transaction on a light node. This information is discarded
     * after a while.
     *  
     * @param txId Transaction ID
     */
    async waitForConfirmation(txId) {

        //instantiate the algod wrapper
        let lastround = (await this.algoClient.status()).lastRound;
        while (true) {
            const pendingInfo = await this.algoClient.pendingTransactionInformation(txId);
            if (pendingInfo.round !== null && pendingInfo.round > 0) {
                //Got the completed Transaction
                console.log("Transaction " + pendingInfo.tx + " confirmed in round " + pendingInfo.round);
                break;
            }
            lastround++;
            await this.algoClient.statusAfterBlock(lastround);
        }
    }

    /**
     * Send a given amount of algos to a given destination
     * 
     * @param from Address (public and private key of sender)
     * @param to_addr Public address of receiver
     * @param amount Number of Algos to send
     * 
     * @return txId: Transaction ID
     */
    async sendAlgos(from, to_addr, amount, payload: any) {

        let note = payload ? algosdk.encodeObj(payload) : undefined
    
        let suggestedParams = await this.algoClient.suggestParams();
    
        // Fixed fee
        suggestedParams.fee = 1000;
        suggestedParams.flatFee = true;
        
        let txn = algosdk.makePaymentTxnWithSuggestedParams(
            from.addr, 
            to_addr, 
            amount, 
            undefined, // closeReminderr
            note, 
            suggestedParams,
            undefined // rekeyTo
        );  
    
        // Sign transaction
        let rawSignedTxn = txn.signTxn(from.sk);

        // Send transaction
        let tx = await this.algoClient.sendRawTransaction(rawSignedTxn)

        // Wait for block confirmation
        await this.waitForConfirmation(tx.txId);

        return {
            transactionID: tx.txId,
        }

    }

    async getTransactionNoteFromAlgoNode(txId) {
        try {
            const pendingInfo = await this.algoClient.pendingTransactionInformation(txId);
            return algosdk.decodeObj(pendingInfo.note)
        }
        catch (e) {
            return null;
        }
    }

    /**
     * Tokenize a payload with the default 
     * 
     * @param message 
     * @param destination 
     */
    async createAsset(creator, manager_addr, payload) {

        // creator and manager m

        let assetMetadataHash = md5(jwt.sign(payload, payload.id))

        let suggestedParams = await this.algoClient.suggestParams();

        // Fixed fee
        suggestedParams.fee = 1000;
        suggestedParams.flatFee = true;
        
        let note = algosdk.encodeObj(payload);

        // manager can: change reserve, freeze, clawback, and manager
        // manager can: freeze or unfreeze user asset holdings
        // manager can: can revoke user asset holdings and send them to other addresses

        let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
            creator.addr, 
            note, 
            1,                  // Non fungible
            0,                  // Indivisible
            false,              // defaultFrozen
            manager_addr,       // manager, 
            manager_addr,       // reserve, 
            manager_addr,       // freeze, 
            manager_addr,       // clawback,
            TOKEN_UNIT_NAME,    // 
            TOKEN_ASSET_NAME, 
            TOKEN_URL, 
            assetMetadataHash, 
            suggestedParams, 
            undefined           // rekeyTo
        );

        let rawSignedTxn = txn.signTxn(creator.sk)

        let tx = await this.algoClient.sendRawTransaction(rawSignedTxn);

        let assetID = null;

        // wait for transaction to be confirmed
        await this.waitForConfirmation(tx.txId);

        // Get the new asset's information from the creator account
        let ptx = await this.algoClient.pendingTransactionInformation(tx.txId);

        assetID = ptx.txresults.createdasset;

        return {
            transactionID: tx.txId,
            assetID: assetID
        }

    }

    async optInAsset(address, assetID) {

        let suggestedParams = await this.algoClient.suggestParams();

        // Fixed fee
        suggestedParams.fee = 1000;
        suggestedParams.flatFee = true;
    
        let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            address.addr, 
            address.addr, 
            undefined,          // closeRemainderTo, 
            undefined,          // revocationTarget,
            0, 
            undefined,          // note, 
            assetID, 
            suggestedParams, 
            undefined           // rekeyTo
        )
        
        let rawSignedTxn = opttxn.signTxn(address.sk);
    
        let opttx = (await this.algoClient.sendRawTransaction(rawSignedTxn));
    
        await this.waitForConfirmation(opttx.txId);

        return {
            transactionID: opttx.txId,
        }
    
    }
    
    /**
     * Notarize a payload on behalf on a owner.
     * Notarization is a transaction to themself
     * with a given node payload
     * 
     * @param message Message to notarize (JSON format)
     * @returns Transaction ID
     */
    async notarize(owner, message: any) {

        return await this.sendAlgos(
            owner, 
            owner.addr, 
            0, 
            message);
        
    }

    /**
     * Transfer an asset from an account to another.
     * Destination need to do optIn before receive the given asset
     * 
     * @param sender 
     * @param receiver 
     * @param assetID 
     * @param message 
     * 
     * @return Transaction ID
     */
    async transferAsset(sender, receiverAddr, assetID, payload: any) {

        let note = payload ? algosdk.encodeObj(payload) : undefined

        let suggestedParams = await this.algoClient.suggestParams();

        // Fixed fee
        suggestedParams.fee = 1000;
        suggestedParams.flatFee = true;

        let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            sender.addr, 
            receiverAddr, 
            undefined,              // closeRemainderTo, 
            undefined,              // revocationTarget,
            1, 
            note, 
            assetID, 
            suggestedParams, 
            undefined               // rekeyTo
        )
            
        let rawSignedTxn = xtxn.signTxn(sender.sk)
    
        let xtx = await this.algoClient.sendRawTransaction(rawSignedTxn)
    
        await this.waitForConfirmation(xtx.txId);

        return {
            transactionID: xtx.txId,
        }  
    }

    /**
     * Returns an account from mnemonic.
     * THe address is validated
     * @param mnemonic Mnemonic of the account
     */
    getAccount(mnemonic: String) : Promise<{ addr: string, sk: string }> {
        var account = algosdk.mnemonicToSecretKey(mnemonic);
        var isValid = algosdk.isValidAddress(account.addr);
        if (!isValid) {
            throw new HttpException('ALGORAND_ADDRESS.BAD_FORMAT', HttpStatus.BAD_REQUEST);
        }
        return account
    }

    /**
     * Return stonize account address and private key 
     * given mnemonic
     */
    async getStonizeAccount() : Promise<{ addr: string, sk: string }> {
        return this.getAccount(process.env.ALGO_ACCOUNT_MNEMONIC)
    }

    /**
     * @return Create an address and return its Mnemonic
     */
    async createAccount() : Promise<AlgorandAccountDto> {
        let account = algosdk.generateAccount();
        var mnemonic = algosdk.secretKeyToMnemonic(account.sk);
        return new AlgorandAccountDto({
            mnemonic: mnemonic,
            account: account
        })
    }

    async getTransactionNoteByScrapingAlgoexplorer(txId) {

        let browser = await puppeteer.launch()
        
        //opening a new page and navigating to Reddit
        const page = await browser.newPage();
    
        await page.goto(`https://testnet.algoexplorer.io/tx/${txId}`);
    
        await page.waitForSelector('body');
    
        await page.waitForSelector('div .paper-value-tx');
    
        //manipulating the page's content
        let notes = await page.evaluate(() => {
            let result = []
            let divs = document.body.querySelectorAll('div .paper-value-tx')
            divs.forEach (item => {
                result.push({"note": (item as any).innerText})
            })
            return result
        });
    
        // outputting the scraped data
        let value = undefined
        
        try {
            value = JSON.parse(notes[0].note);
        }
        catch (e) {
        }
    
        // closing the browser
        await browser.close();
    
        return value;
    } 
    
}
