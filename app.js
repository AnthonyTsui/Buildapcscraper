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
		$('.item-container a').each((i, temp) =>{	//returns names and used(?) prices but will not return actual prices along with link references
			const item = $(temp).text();
			console.log(item);

		});
		


		//console.log(output);
		console.log("------Finished running------");
	}
})


app.get('/', (req,res) => res.send('Hello World!'))

app.listen(port, () => console.log('App listening on port ${port}!'))


