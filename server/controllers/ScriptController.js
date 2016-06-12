var spawn = require('child_process').spawn;
var path = require('path');
<<<<<<< HEAD
var fs = require('fs');
=======
>>>>>>> locker
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
<<<<<<< HEAD
        return res.status(200).send([]);
      }
    });
  });
  // ------------------------------------------------------------------------

  /*
   *  Route to get the scripts found in the scriptsConf.json
   */
  expressApp.get('/script/local', function(req, res) {
    var scriptsConfPath = path.join(__dirname, '..', '..', 'scripts', 'scriptsConf.json');
    scriptsConfPath = path.normalize(scriptsConfPath);

    var scriptsConf;

    try {
      scriptsConf = JSON.parse(fs.readFileSync(scriptsConfPath));
      return res.status(200).send(scriptsConf);
    } catch (e) {
      return res.status(400).send("Could not read the scripts configuration file.");
    }
  });
  // ------------------------------------------------------------------------

  /*
   *  Route to request the creation of a new script
   */
  expressApp.post('/script', function(req, res) {
    if (!req.body.user) return res.status(400).send("No user in the body.");
    if (!req.body.script) return res.status(400).send("No script in the body.");
    if (!req.body.script.name) return res.status(400).send("Script needs a name.");

    var options = {
      url: expressApp.settings.host + "/script",
      method: "POST",
      form: {user: req.body.user,
            script: {
                      name:req.body.script.name,
                      script_file: req.body.script.script_file,
                      description: req.body.script.description,
                      args: req.body.script.args
                    }
      },
      header: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    };

    request(options, function(error, resp, body) {
      if (error) return res.status(400).send("Error with the request.");

      var responseString;

      try {
        responseString = JSON.parse(body);
        return res.status(200).send(responseString);
      } catch (e) {
        return res.status(400).send(body);
      }
    });
  });
  // ------------------------------------------------------------------------

  /*
   *  Route to request changes to a script
   */
  expressApp.put('/script', function(req, res) {
    if (!req.body.user) return res.status(400).send("No user in the body.");
    if (!req.body.script) return res.status(400).send("No script in the body.");
    if (!req.body.script.name) return res.status(400).send("Script needs a name.");
    if (!req.body.script.script_file) return res.status(400).send("Script needs a file name");

    var options = {
      url: expressApp.settings.host + "/script",
      method: "PUT",
      form: { user: req.body.user,script: req.body.script },
      header: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    };

    request(options, function(error, resp, body) {
      if (error) return res.status(400).send("Error with the request.");

      var responseString;

      try {
        responseString = JSON.parse(body);
        return res.status(200).send(responseString);
      } catch (e) {
        return res.status(400).send(body);
      }
    });
  });
  // ------------------------------------------------------------------------

  /*
   *  Route to delete a script
   */
  expressApp.post('/script/:name/remove', function(req, res) {
    if (!req.body.user) return res.status(400).send("No user in the body.");

    var options = {
      url: expressApp.settings.host + '/script/' + req.params.name + '/remove',
      method: "POST",
      form: {user: req.body.user},
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    request(options, function(error, resp, body) {
      if (error) return res.status(400).send("There was an error with the request.");

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


  expressApp.post('/script/run/:name', function(req, res) {
    var script = path.join(__dirname, '..', '..', 'scripts', req.body.script.script_file + "");
    script = path.normalize(script);
    var lock;

    if (req.body.script.args && req.body.script.args.length > 0) {
      lock = spawn(script, req.body.script.args);
    } else {
      lock = spawn(script);
    }

    return res.status(200).send('Run script accepted.');
=======
        return res.status(400).send(e);
      }
    });
>>>>>>> locker
  });
  // ------------------------------------------------------------------------

  return function(req, res, next) {
    next();
  };
};
