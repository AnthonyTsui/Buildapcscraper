const keysearches = require('../models').keysearches;
const searchresults = require('../models').searchresults;

module.exports = {
  create(req, res)
  {
    return keysearches
      .create({
        title: req.body.title,
        itemtype: req.body.itemtype,
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  list(req,res)
  {
    return keysearches
	    .findAll()
	    .then(keysearches=> res.status(200).send(keysearches))
	    .catch(error => res.status(400).send(error))
  },
  retrieve(req, res)
  {
  	return keysearches
  	    .findOne({where:{title: req.params.keyword}})
  	    .then(keysearches =>
	    {
	      if (!keysearches)
	      {
	        return res.status(404).send({message: 'Item Not Found',});
	      }
	      return res.status(200).send(keysearches);
	    })
	    .catch(error => res.status(400).send(error));
  },
  update(req, res) 
  {
	  return keysearches
	    .findOne({where:{title: req.params.keyword}})
	    .then(keysearches =>
	    {
	      if (!keysearches)
	      {
	        return res.status(404).send({
	          message: 'Item Not Found',
	        });
	      }
	      return keysearches
	        .update({
	        	itemtype: req.body.itemtype || keysearches.itemtype,
	        })
	        .then(() => res.status(200).send(keysearches))  // Send back the updated todo.
	        .catch((error) => res.status(400).send(error));
	    })
	    .catch((error) => res.status(400).send(error));
  },
  destroy(req, res) {
  return keysearches
    .findOne({where:{title: req.params.keyword}})
    .then(keysearches => {
      if (!keysearches) {
        return res.status(400).send({
          message: 'Item Not Found',
        });
      }
      return keysearches
        .destroy()
        .then(() => res.status(200).send({message: 'Item entry successfully deleted.'}))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
},

};