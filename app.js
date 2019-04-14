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

function neweggRequest($, itemNames, itemPrices, imgUrls, itemUrls, itemSource ){
	$('.item-container').each((i, temp) =>{	
				const itemPrice= $(temp).find('.price-current').text().replace(/\s\s+/g, '');
				const itemName = $(temp).find('.item-title').text().replace(/\s\s+/g, '');
				const imgUrl = $(temp).find('img').attr('src');
				const itemUrl = $(temp).find('a').attr('href');

				itemNames.push(itemName);

				itemPrices.push(itemPrice);

				imgUrls.push(imgUrl);

				itemUrls.push(itemUrl);

				itemSource.push("Newegg");

			});

			//console.log("------Finished running Newegg request------");
}


function ebayRequest($, itemNames, itemPrices, imgUrls, itemUrls, itemSource ){
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


				itemNames.push(itemName);

				itemPrices.push(itemPrice);

				imgUrls.push(imgUrl);

				itemUrls.push(itemUrl);

				itemSource.push("ebay");

				

			});

			//console.log("------Finished running request------");
}



function amazonRequest($, itemNames, itemPrices, imgUrls, itemUrls, itemSource ){
	let counter = 0;
	$('.sg-col-inner').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
				$('.a-section.a-spacing-medium').each((i, temp) =>{
					let itemPrice = $(temp).find('span.a-price-whole').eq(0).text();			
					const itemName = $(temp).find('span.a-size-medium.a-color-base.a-text-normal').text();
					const imgUrl = $(temp).find('.s-image').attr('src');			//this works for finding image links but returns several undefined
					const itemUrl = $(temp).find('a.a-link-normal.a-text-normal').eq(0).attr('href');
					//console.log("Index for amazon is: " + counter);
					counter += 1;
					if(counter <= 100){
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
								//console.log("See price on site");
								itemPrice = "See price on site";
							}
							//console.log("https://www.amazon.com" + itemUrl);
						}
					
						if(itemUrl != undefined || itemName != '')
						{
							itemNames.push(itemName);
							//console.log("Logged index " + i + " of itemNames with: " + itemName);

							itemPrices.push(itemPrice);
							//console.log("Logged index " + i + " of itemPrices with: " + itemPrice);

							imgUrls.push(imgUrl);
							//console.log("Logged index " + i + " of imgUrls with: " + imgUrl);

							itemUrls.push(itemUrl);
							//console.log("Logged index " + i + " of itemUrls with: " + itemUrl);

							itemSource.push("amazon");
						}

					}
					
					

				})

			});

			//console.log("------Finished running request------");
}

//routes begin below 	-------------------------------------------------------------------------------------------------------------------------


app.get('/', function(req, res)
{
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	let itemUrls = [];
	let itemSource = [];
	//Preliminary testing to render data to front end

	let url = 'https://www.amazon.com/s?k=1080&ref=nb_sb_noss' // amazon test link
	

	axios.get(url)
		.then((response) => {
			if(response.status === 200) {
				const html = response.data;
				const $ = cheerio.load(html);
				amazonRequest($, itemNames, itemPrices, imgUrls, itemUrls, itemSource); //Simplifying some code into a function above, need to look into shortening more with promises or otherwise


				res.render('pages/home',
			        {
			        	keyword: null,
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
    
});




app.get('/search', function(req,res){

	res.render('pages/search',
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
	let source = [];
	let url = 'http://localhost:8000/api/searchresults/' + keyword;

	axios.post(url)
		.then((response) => {
			if(response.status === 200) {
				console.log(response.data.length);
				for(let i = 0; i < response.data.length; i++){
					itemNames[i] = response.data[i].title;
					itemPrices[i] = response.data[i].price;
					imgUrls[i] = response.data[i].image;
					if(response.data[i].source == 'amazon' || response.data[i].source == 'Amazon')
					{
						itemUrls[i] = 'https://www.amazon.com'+response.data[i].link;
					}
					else
					{
						itemUrls[i] = response.data[i].link;
					}
					
					source[i] = response.data[i].source;
				}
				res.render('pages/search',
			        {
			        	keyword:keyword,
			         	productNames: itemNames,
			         	productPrices: itemPrices,  
			         	imgUrls: imgUrls,
			         	itemUrls: itemUrls,
			         	source: source,
			        });
			}

		}, (error) => {console.log("Error on request" + error);
				res.render('pages/search',
			        {
			        	keyword: null,
			         	productNames: null,
			         	productPrices: null,  
			         	imgUrls: null,
			         	itemUrls: null,
			         	source: null,
			        });

		});

	
});



app.post('/searchSubstr', function(req,res){
	let keyword = req.body.keyword;
	let itemNames = [];
	let itemPrices = [];
	let imgUrls = [];
	let itemUrls = [];
	let source = [];
	let url = 'http://localhost:8000/api/searchresults/all/'+keyword;

	axios.post(url)
		.then((response) => {
			if(response.status === 200) {
				console.log(response.data.length);
				for(let i = 0; i < response.data.length; i++){
					itemNames[i] = response.data[i].title;
					itemPrices[i] = response.data[i].price;
					imgUrls[i] = response.data[i].image;
					if(response.data[i].source == 'amazon' || response.data[i].source == 'Amazon')
					{
						itemUrls[i] = 'https://www.amazon.com'+response.data[i].link;
					}
					else
					{
						itemUrls[i] = response.data[i].link;
					}
					
					source[i] = response.data[i].source;
				}
				res.render('pages/search',
			        {
			        	keyword:keyword,
			         	productNames: itemNames,
			         	productPrices: itemPrices,  
			         	imgUrls: imgUrls,
			         	itemUrls: itemUrls,
			         	source: source,
			        });
			}

		}, (error) => {console.log("Error on request with url" + url +  " with error " +error);
				res.render('pages/search',
			        {
			        	keyword: null,
			         	productNames: null,
			         	productPrices: null,  
			         	imgUrls: null,
			         	itemUrls: null,
			         	source: null,
			        });

		});

	
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
	let itemSource = [];


	let amazonurl = 'https://www.amazon.com/s/?field-keywords=' + keyword;
	//console.log(amazonurl);
	let neweggurl = 'https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description='+keyword+'&N=-1&isNodeId=1';
	//console.log(neweggurl);
	let ebayurl = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_nkw='+keyword+'&_sacat=0';
	//console.log(ebayurl);

	//Axios implementation below ----------------------------

	axios.all([axios.get(amazonurl), axios.get(neweggurl), axios.get(ebayurl)])
		.then(axios.spread((amazonres, neweggres, ebayres) =>{
			console.log("Before amazon res");
			let html = amazonres.data;
			let $ = cheerio.load(html);
			amazonRequest($, itemNames, itemPrices, imgUrls, itemUrls, itemSource);

			console.log("Before neweggres");
			html = neweggres.data;
			$ = cheerio.load(html);
			neweggRequest($, itemNames, itemPrices, imgUrls, itemUrls, itemSource);

			console.log("Before ebayres");
			html = ebayres.data;
			$ = cheerio.load(html);
			ebayRequest($, itemNames, itemPrices, imgUrls, itemUrls, itemSource);

			const start = async() => {
				for( var i = 0; i < itemNames.length; i++){
					await axios.post('http://localhost:8000/api/keysearches/'+keyword+'/searchresults',{
					title: itemNames[i],
					image: imgUrls[i],
					link: itemUrls[i],
					price: itemPrices[i],
					source: itemSource[i],
					})
					.then(response => response.data)
					.catch(error => {
						if(error.response){
							console.log("Error code: " + error.response);
						}
					});
				}
			}

			start();



			console.log("Done, we're gonna load now");
			res.render('pages/result',
					        {
					        	keyword:keyword,
					         	productNames: itemNames,
					         	productPrices: itemPrices,  
					         	imgUrls: imgUrls,
					         	itemUrls: itemUrls,
					        });




		}
		, (error) => {console.log("Error on request" + error);
				res.render('pages/result',
			        {
			        	keyword: null,
			         	productNames: null,
			         	productPrices: null,  
			         	imgUrls: null,
			         	itemUrls: null,
			        });

		}));
	});




app.get('*', (req, res) => res.status(200).send({
  message: "Uh oh you shouldn't be here.",
}));

module.exports = app;
