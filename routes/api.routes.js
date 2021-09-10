const finnhub = require('finnhub');
const express = require("express");
const router = express.Router(); 
const axios = require('axios');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c4psplqad3icgcuepmdg"
const finnhubClient = new finnhub.DefaultApi()

//search for stock
router.get('/quote', (req, res, next) => {
    const query = req.query.symbol;
    const stock = query.toUpperCase();

    // axios.get(`https://finnhub.io/api/v1/search?q=${stock}&token=c4psplqad3icgcuepmdg`).then((response) => {console.log(response.data.result)})

       const quote = ()=> {
           finnhubClient.quote(`${stock}`, (error, quoteData, response) => {
                console.log("this is stockData: " , quoteData)
                return quoteData;
            //     console.log(quoteData)
            //  res.render('stocks/stocks-info', {quoteData, stock});
              })
    } 
           


        finnhubClient.companyProfile2({'symbol': stock}, (error, companyData, response) => {
                console.log("this is companyData: ", companyData)
                
        })

        res.render('stocks/stocks-info', {quoteData, companyData, stock});
        
})


module.exports = router;