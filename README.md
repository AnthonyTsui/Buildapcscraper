# webscraper-pricechecker
Building a price checker of PC parts/ various products with the usage of a web scarper or just interacting with APIs.
Current sites being used/scraped are: Amazon, Ebay, Newegg. (Potentially) other sites: Fry's, Microcenter

Database updates/creations will be done with node-cron or another similar module, actual searching will be querying the results in the database. Front end will be built with standard HTML/CSS with ejs templating, with Postgres as the database. Front end will be switched to React once I get better at that :P

No plans for users or sessions at the moment.


This app is using the following dependencies:
* Cheerio v1.0.0-rc.2
* Express v4.16.4
* ejs v2.6.1
* Body-Parser v1.18.3
* Morgan v1.9.1
* Sequelize v5.1.0
* Axios v0.18.0
	
