
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function getTransactionNode(txId) {

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
            result.push({"note": item.innerText})
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

(async () => {

    let value = await getTransactionNode("3I2PMKD6PPE6C62CPLXVZKU7UJFQ3SCLHFY66NRQ65EQ4OPHG7BA")
    console.log(value)
    
})()
