(function() {
  'use strict';

  module.exports.findOrCreate = function(profile, cb) {
    console.log('findOrCreate profile', profile);
    cb(null, profile);
  };
}());
