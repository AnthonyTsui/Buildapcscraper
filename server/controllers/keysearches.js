const keysearches = require('../models').keysearches;

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
};