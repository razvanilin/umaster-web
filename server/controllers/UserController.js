var request = require('request');

module.exports = function(expressApp, route) {

  var options = {
    url: expressApp.settings.host,
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  };

  expressApp.post('/user/signup', function(req, res) {
    var signupOp = options;
    signupOp.url = expressApp.settings.host + "/user/signup";
    signupOp.form = req.body;
    signupOp.method = "POST";

    request(signupOp, function(error, resp, body) {
      if (error) return res.status(400).send(error);
      console.log(body);
      try {
        var responseString = JSON.parse(body);
        console.log(responseString);
        return res.status(200).send(responseString);
      } catch (e) {
        return res.status(200).send(body);
      }
    });
  });

  expressApp.post('/user/login', function(req, res) {
    var loginOp = options;
    loginOp.url = expressApp.settings.host + "/user/login";
    loginOp.form = req.body;
    loginOp.method = "POST";

    request(loginOp, function(error, resp, body) {
      if (error) return res.status(400).send("Something went wrong");
      console.log(body);
      var responseString = JSON.parse(body);
      console.log(responseString);
      return res.status(200).send(responseString);
    });
  });

  return function(req, res, next) {
    next();
  };

};
