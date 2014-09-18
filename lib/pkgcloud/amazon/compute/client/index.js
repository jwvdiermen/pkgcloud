/*
 * index.js: Compute client for AWS CloudAPI
 *
 * (C) 2012 Nodejitsu Inc.
 *
 */

var qs     = require('querystring'),
    util   = require('util'),
    urlJoin = require('url-join'),
    xml2js = require('xml2js'),
    auth   = require('../../../common/auth'),
    amazon = require('../../client'),
    _      = require('underscore');

var Client = exports.Client = function (options) {
  amazon.Client.call(this, options);

  this.securityGroup = options.securityGroup;

  _.extend(this, require('./flavors'));
  _.extend(this, require('./images'));
  _.extend(this, require('./servers'));
  _.extend(this, require('./keys'));
  _.extend(this, require('./groups'));

  this.before.push(auth.amazon.bodySignature);
};

util.inherits(Client, amazon.Client);

Client.prototype._query = function query(action, query, callback) {
  return this._request({
    method: 'POST',
    headers: { },
    body: _.extend({ Action: action }, query)
  }, function (err, body, res) {
    if (err) {
      return callback(err);
    }
    var parser = new xml2js.Parser();

    parser.parseString(body, function (err, data) {
      return err
        ? callback(err)
        : callback(err, data, res);
    });
  });
};

Client.prototype._getUrl = function (options) {
  options = options || {};

  return urlJoin(this.protocol + this.serversUrl,
    (typeof options === 'string'
      ? options
      : options.path));
};
