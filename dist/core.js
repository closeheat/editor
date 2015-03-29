var Core, Promise, _;

_ = require('lodash');

Promise = require('bluebird');

module.exports = Core = (function() {
  function Core(api_token) {}

  Core.prototype.load = function() {
    return console.log('lodadin');
  };

  return Core;

})();
