const keysearchesController = require('../controllers').keysearches;
const searchresultsController = require('../controllers').searchresults;

module.exports = (app) => {
	app.get('/api', (req, res) => res.status(200).send({
		message: 'Welcome to the keysearches API',
	}));

	app.post('/api/keysearches', keysearchesController.create);
	app.get('/api/keysearches', keysearchesController.list);

	app.post('/api/keysearches/:searchID/searchresults', searchresultsController.create);
	app.get('/api/searchresults', searchresultsController.list);
};