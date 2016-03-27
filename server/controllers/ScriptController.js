var spawn = require('child_process').spawn;
var path = require('path');
var request = require('request');

module.exports = function(expressApp, route) {

  /*
   *  Route to get the scripts
   */
  expressApp.get('/script', function(req, res) {
    if (!req.query.user) return res.status(400).send("No user found in the query.");

    var options = {
      url: expressApp.settings.host + "/script/?user=" + req.query.user,
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    request(options, function(error, resp, body) {
      if (error) return res.status(400).send("Error making the request.");

      var responseString;
      try {
        responseString = JSON.parse(body);
        return res.status(200).send(responseString);
      } catch (e) {
        return res.status(400).send(e);
      }
    });
  });
  // ------------------------------------------------------------------------

  return function(req, res, next) {
    next();
  };
};
