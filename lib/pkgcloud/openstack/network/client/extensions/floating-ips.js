/*
 * floating-ips.js: OpenStack Floating IP Extension
 *
 * (C) 2014 Crealuz
 *      Jan Willem van Diermen
 * MIT LICENSE
 *
 */

var urlJoin = require('url-join');

var _extension = '/v2.0/floatingips';

/**
 * client.allocateNewFloatingIp
 *
 * @description Allocates a new floating IP address, optionally associating it with the given port.
 *
 * @param {object|Function}   options
 * @param {Function}          callback
 * @returns {*}
 */
exports.allocateNewFloatingIp = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var body = {
    floatingip: options.floatingIp || options.floatingip,
    tenant_id: options.tenantId || options.tenant_id,
    floating_network_id: options.floatingNetworkId || options.floating_network_id,
    fixed_ip_address: options.fixedIpAddress || options.fixed_ip_address,
    floating_ip_address: options.floatingIpAddress || options.floating_ip_address,
    port_id: options.portId || options.port_id,
    id: options.id || options.id,
  };

  var requestOpts = {
    path: _extension,
    method: 'POST',
    body: {
      floatingip: body
    }
  };

  return this._request(requestOpts, function(err, body) {
    return err
      ? callback(err)
      : callback(err, body.floatingip.floating_ip_address, body);
  });
};

/**
 * client.getFloatingIp
 *
 * @description Get the details of a specific floating IP.
 *
 * @param {String|Object}   floatingIp     The floatingIp ID or object to get the details for
 * @param {function}        callback
 * @returns {*}
 */
exports.getFloatingIp = function(floatingIp, callback) {
  var floatingIpId = (typeof floatingIp === 'object') ? floatingIp.id : floatingIp;

  return this._request({
    path: urlJoin(_extension, floatingIpId)
  }, function (err, body) {
    return err
      ? callback(err)
      : callback(err, body.floatingip.floating_ip_address, body.floatingip);
  });
};

/**
 * client.getFloatingIp
 *
 * @description Updates the association of a specific floating IP with a port.
 *
 * @param {String|Object}   floatingIp     The floatingIp ID or object to update
 * @param {String|Object}   port           The port ID or object to associate
 * @param {function}        callback
 * @returns {*}
 */
exports.associateFloatingIp = function(floatingIp, port, callback) {
  var floatingIpId = (typeof floatingIp === 'object') ? floatingIp.id : floatingIp,
    portId = port instanceof this.models.Port ? port.id : port;

  return this._request({
    path: urlJoin(_extension, floatingIpId),
    body: {
      floatingip: {
        port_id: portId
      }
    }
  }, function (err, body) {
    return err
      ? callback(err)
      : callback(err, body.floatingip, body);
  });
};

/**
 * client.deallocateFloatingIp
 *
 * @description Deallocates the floating IP address by id
 *
 * @param {String|Object}   floatingIp     The floatingIp ID or object to deallocate
 * @param {function}        callback
 * @returns {*}
 */
exports.deallocateFloatingIp = function (floatingIp, callback) {
  var floatingIpId = (typeof floatingIp === 'object') ? floatingIp.id : floatingIp;

  return this._request({
    path: urlJoin(_extension, floatingIpId),
    method: 'DELETE'
  }, function (err) {
    return callback(err);
  });
};

