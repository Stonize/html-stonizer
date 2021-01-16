const cheerio = require('cheerio')

const htmlStr = `
<div>

  <div class="item">
    <a href="http://www.1.com"></a>
  </div>

  <div class="item">
    <a href="http://www.2.com"></a>
  </div>

  <div class="item">
    <a href="http://www.3.com"></a>
  </div>

  <input type="hidden" value="value"/>

  <input type="hidden" name="token" value="value"/>

</div>
`

const $ = cheerio.load(htmlStr)

console.log($('input').map((i, x) => $(x).attr('name')).filter(x => x !== undefined).toArray())