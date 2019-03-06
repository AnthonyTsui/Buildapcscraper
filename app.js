const express = require('express');
const app = express()
const port = 8000

const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine','ejs');

//Below is testing the newegg website to see what divs can be scraped in order to find the appropriate information
//It seems div class=item-info is inside a div class=item-container, rather than going through item-info classes, to get url links to the product
//and images, may need to go through item-container classes for each page, and then access item-info through item-container for the other info


//Test newegg link: https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=1080&N=-1&isNodeId=1

//request('http://reddit.com', (error, response, html) =>


function neweggRequest2($, itemNames, itemPrices, imgUrls){
	$('.item-container').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
				const itemPrice= $(temp).find('.price-current').text().replace(/\s\s+/g, '');
				const itemName = $(temp).find('.item-title').text().replace(/\s\s+/g, '');
				const imgUrl = $(temp).find('img').attr('src');

				itemNames[i] = itemName;
				console.log("Logged index " + i + " of itemNames with: " + itemName);

				itemPrices[i] = itemPrice;
				console.log("Logged index " + i + " of itemPrices with: " + itemPrice);

				imgUrls[i] = imgUrl;
				console.log("Logged index " + i + " of imgUrls with: " + imgUrl);

			});

			console.log("------Finished running request------");
}



app.get('/', function(req, res)
{
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	//Preliminary testing to render data to front end

	let url = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=1080&N=-1&isNodeId=1';

	
	request(url, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			const $ = cheerio.load(html);

			neweggRequest2($, itemNames, itemPrices, imgUrls); //Simplifying some code into a function above, need to look into shortening more with promises or otherwise

			res.render('pages/home',
		        {
		         	productNames: itemNames,
		         	productPrices: itemPrices,  
		         	imgUrls: imgUrls,
		        });
		}
		else
		{
			console.log("Error on request" + error);
			reject(error);	
		}
	}) 
	


	//Actual render
    
});

app.get('/result', function(req,res){

	res.render('pages/result',
	{	
		keyword:null,
		productNames: null,
		productPrices: null,
		imgUrls: null,
	});
});


//Getting results from keyword
app.post('/result', function(req,res){
	let keyword = req.body.keyword;
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	let url = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description='+keyword+'&N=-1&isNodeId=1';
	request(url, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			const $ = cheerio.load(html);
			neweggRequest2($, itemNames, itemPrices, imgUrls);

			res.render('pages/result',
		        {
		        	keyword:keyword,
		         	productNames: itemNames,
		         	productPrices: itemPrices,  
		         	imgUrls: imgUrls,
		        });
		}
		else
		{
			console.log("Error on request" + error);
			reject(error);	
		}
	})
});

app.get('/', (req,res) => res.send('Hello World!'))

app.listen(port, () => console.log('App listening on port ${port}!'))


