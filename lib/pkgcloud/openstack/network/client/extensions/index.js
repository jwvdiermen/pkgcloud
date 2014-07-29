/*
 * index.js: OpenStack network extension index
 *
 * (C) 2014 Crealuz
 *      Jan Willem van Diermen
 * MIT LICENSE
 */

var utile = require('utile');

var extensions = {
  getExtensions: function(callback) {
    return this._request({
      path: '/v2.0/extensions'
    }, function (err, body, res) {
      return err
        ? callback(err)
        : callback(null, body.extensions, res);
    });
  }
};

utile.mixin(extensions, require('./floating-ips'));

module.exports = extensions;
