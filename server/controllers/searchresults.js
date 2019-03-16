const searchresults = require('../models').searchresults;

module.exports = {
  create(req, res)
  {
    return searchresults
      .create({
        title: req.body.title,
        image: req.body.image,
        link: req.body.link,
        price: req.body.price,
        source: req.body.source,
        searchID: req.params.searchID,
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  list(req,res)
  {
    return searchresults
      .findAll()
      .then(searchresults=> res.status(200).send(searchresults))
      .catch(error => res.status(400).send(error))
  },
};