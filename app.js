const express = require('express');
const port = 8000

const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const logger = require('morgan');
const axios = require('axios');

const app = express()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine','ejs');

require('./server/routes')(app);

//Below is testing the newegg website to see what divs can be scraped in order to find the appropriate information
//It seems div class=item-info is inside a div class=item-container, rather than going through item-info classes, to get url links to the product
//and images, may need to go through item-container classes for each page, and then access item-info through item-container for the other info


//Test newegg link: https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=1080&N=-1&isNodeId=1

function neweggRequest($, itemNames, itemPrices, imgUrls, itemUrls ){
	$('.item-container').each((i, temp) =>{	
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
	$('.s-item').each((i, temp) =>{	
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
				$('.a-section.a-spacing-medium').each((i, temp) =>{
					let itemPrice = $(temp).find('span.a-price-whole').eq(0).text();			
					const itemName = $(temp).find('span.a-size-medium.a-color-base.a-text-normal').text();
					const imgUrl = $(temp).find('.s-image').attr('src');			//this works for finding image links but returns several undefined
					const itemUrl = $(temp).find('a.a-link-normal.a-text-normal').eq(0).attr('href');
					if(imgUrl != undefined)
					{
						//console.log(imgUrl);
						//console.log(itemName);
						if(itemPrice != null && itemPrice != '')
						{
							//console.log("$"+itemPrice);
							itemPrice = "$"+itemPrice;
						}
						else
						{
							console.log("See price on site");
							itemPrice = "See price on site";
						}
						console.log("https://www.amazon.com" + itemUrl);
					}
					
					if(itemUrl != undefined || itemName != '')
					{
						itemNames[i] = itemName;
						console.log("Logged index " + i + " of itemNames with: " + itemName);

						itemPrices[i] = itemPrice;
						console.log("Logged index " + i + " of itemPrices with: " + itemPrice);

						imgUrls[i] = imgUrl;
						console.log("Logged index " + i + " of imgUrls with: " + imgUrl);

						itemUrls[i] = itemUrl;
						console.log("Logged index " + i + " of itemUrls with: " + itemUrl);
					}
					

				})

			});

			console.log("------Finished running request------");
}



let url = 'https://www.amazon.com/s/?field-keywords=1080';
//let url = 'https://www.walmart.com/search/?cat_id=0&query=1080';
let itemNames = [];
let itemPrices = [];
let imgUrls = [];
let itemUrls = [];

/*
request(url, {gzip: true}, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			//console.log(html);
			const $ = cheerio.load(html);
			//console.log($);
			$('.a-section.a-spacing-medium').each((i, temp) =>{
				const testImg = $(temp).find('.s-image').attr('src');			//this works for finding image links but returns several undefined
				const testName = $(temp).find('span.a-size-medium.a-color-base.a-text-normal').text();
				const testPrice = $(temp).find('span.a-price-whole').eq(0).text();			
				const testLink = $(temp).find('a.a-link-normal.a-text-normal').eq(0).attr('href');
				if(testImg != undefined)
				{
					console.log(testImg);
					console.log(testName);
					if(testPrice != null && testPrice != '')
					{
						console.log("$"+testPrice);
					}
					else
					{
						console.log("See price on site");
					}
					console.log("https://www.amazon.com" + testLink);
				}
			})
			console.log("Finished running request");
		}
		else
		{
			console.log("Error on request" + error);
			reject(error);	
		}
	})
*/



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
	let url = 'https://www.amazon.com/s?k=1080&ref=nb_sb_noss' // amazon test link
	 //let url = 'https://www.walmart.com/search/?cat_id=0&query=1080'; // walmart test link
	 //let url = 'https://www.frys.com/search?search_type=regular&sqxts=1&cat=&query_string=1080%20card&nearbyStoreName=false' //frys test link
	 //let url = 'https://www.target.com/s?searchTerm=1080' //target test link

	/*
	request(url, {gzip:true}, (error, response, html) =>
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
		        	keyword: null,
		         	productNames: null,
		         	productPrices: null,  
		         	imgUrls: null,
		         	itemUrls: null,
		        });
		}
	}) */

	axios.get(url)
		.then((response) => {
			if(response.status === 200) {
				const html = response.data;
				const $ = cheerio.load(html);
				amazonRequest($, itemNames, itemPrices, imgUrls, itemUrls); //Simplifying some code into a function above, need to look into shortening more with promises or otherwise


				res.render('pages/home',
			        {
			         	productNames: itemNames,
			         	productPrices: itemPrices,  
			         	imgUrls: imgUrls,
			         	itemUrls: itemUrls,
			        });
			}

		}, (error) => {console.log("Error on request" + error);
				res.render('pages/result',
			        {
			        	keyword: null,
			         	productNames: null,
			         	productPrices: null,  
			         	imgUrls: null,
			         	itemUrls: null,
			        });

		});
	


	//Actual render
    
});


app.get('/resultAmazon', function(req, res)
{
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	let itemUrls = [];
	let url = 'https://www.amazon.com/s/?field-keywords=1080';
	
	request(url,{gzip:true}, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			const $ = cheerio.load(html);

			amazonRequest($, itemNames, itemPrices, imgUrls, itemUrls); //Simplifying some code into a function above, need to look into shortening more with promises or otherwise


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


app.get('/search', function(req,res){

	res.render('pages/result',
	{	
		keyword:null,
		productNames: null,
		productPrices: null,
		imgUrls: null,
		itemUrls: null,
	});
});

app.post('/search', function(req,res){
	let keyword = req.body.keyword;
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	let itemUrls = [];

	axios.post('http://localhost:8000/api/searchresults/'+keyword)

	
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


	let url = 'https://www.amazon.com/s/?field-keywords=' + keyword;
	console.log(url);
	//let url = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description='+keyword+'&N=-1&isNodeId=1';
	/*
	request(url,{gzip:true}, (error, response, html) =>
	{
		if(!error && response.statusCode == 200) 
		{
			const $ = cheerio.load(html);
			amazonRequest($, itemNames, itemPrices, imgUrls, itemUrls);
			


			console.log(itemNames[0], itemPrices[0], imgUrls[0], itemUrls[0]);

			  request.post({url:'http://localhost:8000/api/keysearches/'+keyword+'/searchresults', 
			  		form: {title: itemNames[0], image: imgUrls[0],  link: itemUrls[0], price: itemPrices[0], source: 'Amazon'}}, function(err, response, body)
			  {
			    if(err)
			    {
			      console.log("Error on create SearchResult ");
			    }
			    else
			    {
			      console.log("Created Search Result");
			    }
			  });

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
	})*/

	//Axios implementation below ----------------------------

	axios.get(url)
		.then((response) => {
			if(response.status === 200 || response.status === 201) {
				const html = response.data;
				const $ = cheerio.load(html);
				amazonRequest($, itemNames, itemPrices, imgUrls, itemUrls); //Simplifying some code into a function above, need to look into shortening more with promises or otherwise


				console.log(itemNames[0], itemPrices[0], imgUrls[0], itemUrls[0]);
				/*

				  request.post({url:'http://localhost:8000/api/keysearches/'+keyword+'/searchresults', 
				  		form: {title: itemNames[0], image: imgUrls[0],  link: itemUrls[0], price: itemPrices[0], source: 'Amazon'}}, function(err, response, body)
							  {
							    if(err)
							    {
							      console.log("Error on create SearchResult ");
							    }
							    else
							    {
							      console.log("Created Search Result");
							    }
							  }); 
				*/
				for( var i = 0; i < itemNames.length; i++)
				{
					axios.post('http://localhost:8000/api/keysearches/'+keyword+'/searchresults',{
					title: itemNames[i],
					image: imgUrls[i],
					link: itemUrls[i],
					price: itemPrices[i],
					source: 'Amazon'
					})

				}
				res.render('pages/result',
					        {
					        	keyword:keyword,
					         	productNames: itemNames,
					         	productPrices: itemPrices,  
					         	imgUrls: imgUrls,
					         	itemUrls: itemUrls,
					        });


				/*
				.then((response)=> {
					if(response.status === 200 || response.status === 201){
						console.log("success on search results");
						res.render('pages/result',
					        {
					        	keyword:keyword,
					         	productNames: itemNames,
					         	productPrices: itemPrices,  
					         	imgUrls: imgUrls,
					         	itemUrls: itemUrls,
					        });
					}
				}, (error) => {console.log("Errror on creating search results" + error)
					res.render('pages/result',
			        {
			        	keyword: null,
			         	productNames: null,
			         	productPrices: null,  
			         	imgUrls: null,
			         	itemUrls: null,
			        });


				});*/

				
			}

		}, (error) => {console.log("Error on request" + error);
				res.render('pages/result',
			        {
			        	keyword: null,
			         	productNames: null,
			         	productPrices: null,  
			         	imgUrls: null,
			         	itemUrls: null,
			        });

		});
	
});


//app.listen(port, () => console.log('App listening on port ${port}!'))

//require('./server/routes')(app);

app.get('*', (req, res) => res.status(200).send({
  message: "Uh oh you shouldn't be here.",
}));

module.exports = app;
