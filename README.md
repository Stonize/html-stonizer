# Launch static server
docker run --rm -p 80:80 -v $(pwd)/static:/usr/share/nginx/html:ro -d nginx

# Notarize HTML fragment
http localhost:3000 url="http://localhost/index-original.html" start="This Instaforex " stop="in Asia"

# Verify content in page 
http localhost:3000/verify url="http://localhost/index-original.html"

# Current Limitations and Further Works

Now the API is working on TestNet and transactions are not archived. 
This means that transaction info lasts few minutes before disappear from AlgorandNode.
As workaround we create a scraper of the site algoexplorer to get infromation about transaction.
This piece of code must be transformed in a real interaction with an Archival node.

AlgorandNotarization is limited in space: now we are notaryzing the whole content but in reality
we should only save an hash of current text

API now are using a test account: in production (Algorand Main Net) thre should be an exchange
of credential to use a personal Aogrand account to notarize text speding Algos.



