// https://hackernoon.com/a-guide-to-web-scraping-with-javascript-and-nodejs-i21l3te1

const axios = require('axios');
const cheerio = require('cheerio');

function normalize(content) {
   content = content.replace(/\n/g, ' ');
   content = content.replace(/\s\s+/g, ' ');
   return content
}

function normalizeAndExtract(content, start, stop) {

   content = normalize(content)
   start = normalize(start)
   stop = normalize(stop)

   let iStart = content.indexOf(start)
   let iStop = content.indexOf(stop)

   return content.substring(iStart, iStop + stop.length)

}

axios.get('https://www.forextradingbig.com/instaforex-broker-review/')
      .then(response => {
         const html = response.data;

         const $ = cheerio.load(html);

         let start = "This Instaforex "

         let stop = "in Asia"

         let content = $('body').text();

         let sub = normalizeAndExtract(content, start, stop)

         console.log(sub)

         // console.log($('#text').text())
         // const scrapedata = $('a', '.comment-bubble').text()
         // console.log(scrapedata);
         
      }).catch(error => {
         console.log(error);
      });



