const algosdk = require("algosdk")

const token = "0ac268010e2d59bb77bf85bc04ccb6917ae84fd97eb8677d23fad43b7d6c5604";
const server = "http://15.161.241.198";
const port = 8080;

const client = new algosdk.Algod(token, server, port);

/**
 * Wait that a pending transaction is accepted or not
 * Notice that this method can get the status of a early submitted
 * transaction on a light node. This information is discarded
 * after a while.
 *  
 * @param txId Transaction ID
 */
async function waitForConfirmation(txId) {

    //instantiate the algod wrapper
    let lastround = (await client.status()).lastRound;
    // while (true) {
        const pendingInfo = await client.pendingTransactionInformation(txId);
        console.log(algosdk.decodeObj(pendingInfo.note))

        /*
        if (pendingInfo.round !== null && pendingInfo.round > 0) {
            //Got the completed Transaction
            console.log("Transaction " + pendingInfo.tx + " confirmed in round " + pendingInfo.round);
            break;
        }
        lastround++;
        await this.algoClient.statusAfterBlock(lastround);
        */
    // }
}

(async () => {
    console.log(await client.status());

    await waitForConfirmation("GLWUVVPT2YLYI3ZHAETWSWINYAYC6VMT3ZTMYHAHNBDKE3K5SZZQ");
})().catch(e => {
    console.log(e);
});
