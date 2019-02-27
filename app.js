const express = require('express');
const app = express()
const port = 8000


const request = require('request');
const cheerio = require('cheerio');

//Test newegg link: https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=1080&N=-1&isNodeId=1

//request('http://reddit.com', (error, response, html) =>
	
request('https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=1080&N=-1&isNodeId=1', (error, response, html) =>
{
	if(!error && response.statusCode == 200) 
	{
		/* Testing request and logs to see what is returned
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

		End of prem. testing */

		const $ = cheerio.load(html);

		$('.item-info').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
			const itemPrice= $(temp).find('.price-current').text();
			const itemName = $(temp).find('.item-title').text();
			
			console.log(itemName);
			console.log(itemPrice);
			

		});

		//console.log(output);
		console.log("------Finished running------");
	}
	else
	{
		console.log("Error on request" + error);
	}
})


app.get('/', (req,res) => res.send('Hello World!'))

app.listen(port, () => console.log('App listening on port ${port}!'))


