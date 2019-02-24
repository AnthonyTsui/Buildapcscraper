const express = require('express');
const app = express()
const port = 8000


const request = require('request');
const cheerio = require('cheerio');

request('http://google.com', (error, response, html) =>
{
	if(!error && response.statusCode == 200) 
	{
		//console.log(html);

		const $ = cheerio.load(html);

		const siteHeading = $('.site-heading');

		console.log(siteHeading);
	}
})


app.get('/', (req,res) => res.send('Hello World!'))

app.listen(port, () => console.log('App listening on port ${port}!'))


