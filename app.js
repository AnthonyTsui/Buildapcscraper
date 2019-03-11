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


function neweggRequest($, itemNames, itemPrices, imgUrls, itemUrls ){
	$('.item-container').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
				const itemPrice= $(temp).find('.price-current').text().replace(/\s\s+/g, '');
				const itemName = $(temp).find('.item-title').text().replace(/\s\s+/g, '');
				const imgUrl = $(temp).find('img').attr('src');
				const itemUrl = $(temp).find('a').attr('href');

				itemNames[i] = itemName;
				console.log("Logged index " + i + " of itemNames with: " + itemName);

				itemPrices[i] = itemPrice;
				console.log("Logged index " + i + " of itemPrices with: " + itemPrice);

				imgUrls[i] = imgUrl;
				console.log("Logged index " + i + " of imgUrls with: " + imgUrl);

				itemUrls[i] = itemUrl;
				console.log("Logged index " + i + " of imgUrls with: " + itemUrl);

			});

			console.log("------Finished running Newegg request------");
}


function ebayRequest($, itemNames, itemPrices, imgUrls, itemUrls ){
	$('.s-item').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
				const itemPrice= $(temp).find('.s-item__price').html();	//using .text() returns the current bid price and the buy out price.
				const itemName = $(temp).find('.s-item__image-img').attr('alt'); 
				let imgUrl = $(temp).find('.s-item__image-img').attr('data-src');

				if(imgUrl == undefined)
				{
					//console.log("its undefined at index: " + i)
					imgUrl = $(temp).find('.s-item__image-img').attr('src');
				}


				const itemUrl = $(temp).find('a').attr('href');

				itemNames[i] = itemName;
				//console.log("Logged index " + i + " of itemNames with: " + itemName);

				itemPrices[i] = itemPrice;
				//console.log("Logged index " + i + " of itemPrices with: " + itemPrice);

				imgUrls[i] = imgUrl;
				//console.log("Logged index " + i + " of imgUrls with: " + imgUrl);

				itemUrls[i] = itemUrl;
				console.log("Logged index " + i + " of itemUrls with: " + itemUrl);

				

			});

			console.log("------Finished running request------");
}



function amazonRequest($, itemNames, itemPrices, imgUrls, itemUrls ){
	$('.sg-col-inner').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
				//const itemPrice= $(temp).find('.s-item__price').html();	//using .text() returns the current bid price and the buy out price.
				//const itemName = $(temp).find('.s-item__image-img').attr('alt'); 
				//const imgUrl = $(temp).find('.s-item__image-img').attr('data-src');
				const itemUrl = $(temp).find('.a-link-normal').attr('href');

				//itemNames[i] = itemName;
				//console.log("Logged index " + i + " of itemNames with: " + itemName);

				//itemPrices[i] = itemPrice;
				//console.log("Logged index " + i + " of itemPrices with: " + itemPrice);

				//imgUrls[i] = imgUrl;
				//console.log("Logged index " + i + " of imgUrls with: " + imgUrl);

				//itemUrls[i] = itemUrl;
				//console.log("Logged index " + i + " of itemUrls with: " + itemUrl);

				console.log(itemUrl);

				

			});

			console.log("------Finished running request------");
}



let url = 'https://www.amazon.com/s/?field-keywords=1080';
//let url = 'https://www.walmart.com/search/?cat_id=0&query=1080';
let itemNames = [];
let itemPrices = [];
let imgUrls = [];
let itemUrls = [];


request(url, {gzip: true}, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			//console.log(html);
			const $ = cheerio.load(html);
			//console.log($);
			$('.a-section.a-spacing-medium').each((i, temp) =>{
			//$('.a-section.aok-relative.s-image-fixed-height').each((i, temp) =>{
				//console.log(temp);
				const testImg = $(temp).find('.s-image').attr('src');			//this works for finding image links but returns several undefined
				//const test = $(temp).children('.s-image');

				//console.log(testImg);

				const testName = $(temp).find('span.a-size-medium.a-color-base.a-text-normal').text();
				console.log(testName)	

			})

			
		}
		else
		{
			console.log("Error on request" + error);
			reject(error);	
		}
	})




//routes begin below 	-------------------------------------------------------------------------------------------------------------------------


app.get('/', function(req, res)
{
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	let itemUrls = [];
	//Preliminary testing to render data to front end

	//let url = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=1080&N=-1&isNodeId=1'; //Newegg test link
	//let url = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=1080&_sacat=0'; //ebay test link
	let url = 'https://www.bestbuy.com/site/searchpage.jsp?st=1080&_dyncharset=UTF-8&id=pcat17071&type=page&sc=Global&cp=1&nrp=&sp=&qp=&list=n&af=true&iht=y&usc=All+Categories&ks=960&keys=keys' //bestbuy test link
	//let url = 'https://www.amazon.com/s?k=1080&ref=nb_sb_noss' // amazon test link
	 //let url = 'https://www.walmart.com/search/?cat_id=0&query=1080'; // walmart test link
	 //let url = 'https://www.frys.com/search?search_type=regular&sqxts=1&cat=&query_string=1080%20card&nearbyStoreName=false' //frys test link
	 //let url = 'https://www.target.com/s?searchTerm=1080' //target test link

	
	request(url, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			const $ = cheerio.load(html);

			neweggRequest($, itemNames, itemPrices, imgUrls, itemUrls); //Simplifying some code into a function above, need to look into shortening more with promises or otherwise


			res.render('pages/home',
		        {
		         	productNames: itemNames,
		         	productPrices: itemPrices,  
		         	imgUrls: imgUrls,
		         	itemUrls: itemUrls,
		        });
		}
		else
		{
			console.log("Error on request" + error);
			res.render('pages/result',
		        {
		         	productNames: null,
		         	productPrices: null,  
		         	imgUrls: null,
		         	itemUrls: null,
		        });
		}
	}) 
	


	//Actual render
    
});


app.get('/testGet', function(req, res)
{
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	let itemUrls = [];
	//Preliminary testing to render data to front end

	//let url = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=1080&N=-1&isNodeId=1'; //Newegg test link
	//let url = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw=1080&_sacat=0'; //ebay test link
	let url = 'https://www.bestbuy.com/site/searchpage.jsp?st=1080&_dyncharset=UTF-8&id=pcat17071&type=page&sc=Global&cp=1&nrp=&sp=&qp=&list=n&af=true&iht=y&usc=All+Categories&ks=960&keys=keys' //bestbuy test link

	
	request(url, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			const $ = cheerio.load(html);

			bestbuyRequest($, itemNames, itemPrices, imgUrls, itemUrls); //Simplifying some code into a function above, need to look into shortening more with promises or otherwise


			res.render('pages/home',
		        {
		         	productNames: itemNames,
		         	productPrices: itemPrices,  
		         	imgUrls: imgUrls,
		         	itemUrls: itemUrls,
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
		itemUrls: null,
	});
});


//Getting results from keyword
app.post('/result', function(req,res){
	let keyword = req.body.keyword;
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	let itemUrls = [];


	let url = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description='+keyword+'&N=-1&isNodeId=1';
	request(url, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			const $ = cheerio.load(html);
			neweggRequest2($, itemNames, itemPrices, imgUrls, itemUrls);

			res.render('pages/result',
		        {
		        	keyword:keyword,
		         	productNames: itemNames,
		         	productPrices: itemPrices,  
		         	imgUrls: imgUrls,
		         	itemUrls: itemUrls,
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


