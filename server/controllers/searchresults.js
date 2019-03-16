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
        searchterm: req.params.searchterm,
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

  retrieve(req, res)
  {
    return searchresults
        .findAll({where:{searchterm: req.params.keyword}})
        .then(searchresults =>
      {
        if (!searchresults)
        {
          return res.status(404).send({message: 'Item Not Found',});
        }
        return res.status(200).send(searchresults);
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res) 
  {
    return searchresults
      .findOne({where:{id: req.params.resultID}})
      .then(searchresults =>
      {
        if (!searchresults)
        {
          return res.status(404).send({
            message: 'Item Not Found',
          });
        }
        return searchresults
          .update(req.body, {fields: Object.keys(req.body) })
          .then(() => res.status(200).send(searchresults))  // Send back the updated todo.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  destroy(req, res) {
  return searchresults
    .find({where:{id: req.params.resultID}})
    .then(searchresults => {
      if (!searchresults) {
        return res.status(400).send({
          message: 'Item Not Found',
        });
      }
      return searchresults
        .destroy()
        .then(() => res.status(200).send({message: 'Search entry successfully deleted.'}))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
},


};