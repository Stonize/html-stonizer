const jwt = require('jsonwebtoken');

let secret = "27e7c192-f65a-11ea-a9ee-97bbf6015c81"

let payload = {
    email: 'chrome-extension-0.0.2@stonize.com'
}

let exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365);

var token = jwt.sign({ 
    exp: exp,
    ... payload
}, secret);

console.log(token)