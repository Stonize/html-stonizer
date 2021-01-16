<p align="center">
  <a href="http://stonize.com/" target="blank"><img src="https://stonize.com/static/media/logo_2.b1e2c59b.png" width="320" alt="Stonize Logo" /></a>
</p>

# Notarize an HTML fragment

As use case we want to notarize an important financial report from `forextradingbig`:

```
http <ServiceUrl> url="https://www.forextradingbig.com/instaforex-broker-review/" start="This Instaforex " stop="in Asia"
```

This command will return the following:

```
{
    "transaction": ""   
    url: "https://www.forextradingbig.com/instaforex-broker-review/",
    content: "3I2PMKD6PPE6C62CPLXVZKU7UJFQ3SCLHFY66NRQ65EQ4OPHG7BA"
}
```

# Put your HTML fragment in the stone!

Now you can let people know that you saved your html fragment simply inserting the following hidden input in your page:

```
<input type="hidden" name="tokenization" value="3I2PMKD6PPE6C62CPLXVZKU7UJFQ3SCLHFY66NRQ65EQ4OPHG7BA" start="This Instaforex " stop="in Asia"/>
```

# Verify content in page 

A user that want to check if some pieces of the page are saved in blockchain he can invoke the following API:

```
http <ServiceUrl>/verify url="https://www.forextradingbig.com/instaforex-broker-review/"
```

# Current Limitations and Further Works

Now the API is working on TestNet and transactions are not archived. 
This means that transaction info lasts few minutes before disappear from AlgorandNode.
As workaround we create a scraper of the site algoexplorer to get infromation about transaction.
This piece of code must be transformed in a real interaction with an Archival node.

AlgorandNotarization is limited in space: now we are notaryzing the whole content but in reality
we should only save an hash of current text

API now are using a test account: in production (Algorand Main Net) thre should be an exchange
of credential to use a personal Aogrand account to notarize text speding Algos.



