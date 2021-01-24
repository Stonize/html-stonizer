// https://hackernoon.com/a-guide-to-web-scraping-with-javascript-and-nodejs-i21l3te1

const axios = require('axios');
const cheerio = require('cheerio');

function normalize(content) {
   content = content.replace(/\n/g, ' ');
   content = content.replace(/\s\s+/g, ' ');
   return content
}

axios.get('https://www.forextradingbig.com/instaforex-broker-review/')
      .then(response => {
          
         const html = response.data;

         const $ = cheerio.load(html);

        var iterate = function(node, level) {
            if (typeof level === "undefined") level = "--";
            var list = $(node).contents().filter(function() { return true; });
            for (var i=0; i<=list.length-1; i++) {
                var item = list[i];
                if (item && item.type && item.parent && item.parent.type !== 'script' && item.parent.type !== "style") {
                    // console.log(item)
                    console.log(level, "(" + i + ")", item.type, $(item).text());
                    iterate(item, level + "--");
                }
            }
        }

        iterate($.root());

         // let start = "This Instaforex "
         // let stop = "in Asia"

         // let content = $('body').filter((i, x) => x.type == 3).map((i, x) => x.tag)

         // let sub = normalizeAndExtract(content, start, stop)

         // console.log(sub)

         // console.log(content)

         // console.log($('#text').text())
         // const scrapedata = $('a', '.comment-bubble').text()
         // console.log(scrapedata);
         
      }).catch(error => {
         console.log(error);
      });



