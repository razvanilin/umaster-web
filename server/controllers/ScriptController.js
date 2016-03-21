var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(expressApp, route) {

  expressApp.get('/script/lock', function(req, res) {
    var lockScript = path.join(__dirname, 'lock.bat');
    lockScript = lockScript.replace('controllers\\', '');
    var lock = spawn(lockScript);

    return res.status(200).send('Lock script accepted.');
  });

  return function(req, res, next) {
    next();
  };
};
