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

let keyword2 = '1070';
let url = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description='+keyword2+'&N=-1&isNodeId=1'

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
/*	
function neweggRequest(url, itemNames, itemPrices, imgUrls, renderPage){
	request(url, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			const $ = cheerio.load(html);

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

				//console.log(itemName);
				//console.log(itemPrice);
				//console.log("should be below here");
				//console.log(itemNames[3]);
			});

			console.log("------Finished running request------");
			
			res.render(renderPage,
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
}
*/
/*
request(url, (error, response, html) =>
{
	if(!error && response.statusCode == 200) 
	{
		// Testing request and logs to see what is returned
		//console.log(html);

		const $ = cheerio.load(html);
		//const siteHeading = $('.site-heading');

		//console.log(html);

		//const output = siteHeading.find('h1').text();
		//const output = siteHeading;
		//const output = $('.page-content'); //returning this as console.log(output.html()) performs as expected
		const eachResult = $('.item-container'); 
			//console.log(eachResult.text()) will return the text of all the expected data including button text, image links, descs, titles
			//const output = eachResult.text(); this also works
		//const output = eachResult.

		//Div class item-container
		$('.item-container a').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
			const item = $(temp).text();
			//console.log(item);

		});

		console.log("End of item-container")

		//Div class item-info but only contains 'a' classes
		$('.item-info a').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
			const item = $(temp).text();

			//console.log(item);

		}); 

		//End of prem. testing 
		

		const $ = cheerio.load(html);

		$('.item-container').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
			const itemPrice= $(temp).find('.price-current').text().replace(/\s\s+/g, ''); //.replace(/\s\s+/g, '') replaces all the blank spaces
			const itemName = $(temp).find('.item-title').text().replace(/\s\s+/g, '');
			const imgUrls = $(temp).find('img').attr('src');	//Grabbing image link to each product

			
			console.log(itemName);
			console.log(itemPrice);
			console.log(imgUrls);
			

		});

		//console.log(output);
		console.log("------Finished running------");
	}
	else
	{
		console.log("Error on request" + error);
	}
})
*/


//Base page



app.get('/', function(req, res)
{
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	//Preliminary testing to render data to front end

	let url = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=1080&N=-1&isNodeId=1';

	/*
	res.render('pages/home',
		        {
		         	productNames: itemNames,
		         	productPrices: itemPrices,  
		         	imgUrls: imgUrls,
		        });*/

	
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

			/* Can delete below here

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

				//console.log(itemName);
				//console.log(itemPrice);
				//console.log("should be below here");
				//console.log(itemNames[3]);

			});
			*/
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


