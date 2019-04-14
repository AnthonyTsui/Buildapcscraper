const keysearchesController = require('../controllers').keysearches;
const searchresultsController = require('../controllers').searchresults;

module.exports = (app) => {
	app.get('/api', (req, res) => res.status(200).send({
		message: 'Welcome to the keysearches API',
	}));

	app.post('/api/keysearches', keysearchesController.create);
	app.get('/api/keysearches', keysearchesController.list);
	app.get('/api/keysearches/:keyword', keysearchesController.retrieve);
	app.put('/api/keysearches/:keyword', keysearchesController.update);
	app.delete('/api/keysearches/:keyword', keysearchesController.destroy);

	app.post('/api/keysearches/:searchterm/searchresults', searchresultsController.create);
	app.get('/api/searchresults', searchresultsController.list);
	app.post('/api/searchresults/:keyword', searchresultsController.retrieve);
	app.post('/api/searchresults/all/:keyword', searchresultsController.like);

	app.put('/api/searchresults/:resultID', searchresultsController.update);
	app.delete('/api/searchresults/:resultID', searchresultsController.destroy);
};