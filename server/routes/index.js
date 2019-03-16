const keysearchesController = require('../controllers').keysearches;

module.exports = (app) => {
	app.get('/api', (req, res) => res.status(200).send({
		message: 'Welcome to the keysearches API',
	}));

	app.post('/api/keysearches', keysearchesController.create);
};