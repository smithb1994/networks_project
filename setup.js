var q = require('q');
var _ = require('lodash');
var ifconfig = require('wireless-tools/ifconfig');
var hostapd = require('wireless-tools/hostapd');
var iwlist = require('wireless-tools/iwlist');
var wpa_supplicant = require('wireless-tools/wpa_supplicant');

var setup = {};


setup.run = function (query) {
  return q.Promise(function (resolve, reject, notify) {
    //get list of interfaces
    ifconfig.status(function(error, status) {
      if(error) reject(error);
      resolve(_.slice(status, _.findIndex(status, {interface: 'lo'})+1));
    });
  }).then(function (network_interfaces) {

    //setup access point
    return q.Promise(function (resolve, reject, notify) {
      hostapd.enable({
        channel: Math.floor(Math.random()*(10-1+1)+1),
        hw_mode: 'g',
        interface: network_interfaces[0].interface,
        ssid: 'meshnet_'+network_interfaces[0].address
      }, function(error) {
        if(error) reject(error);
        resolve();
      });
    }).then(function (data) {

      //scan for mesh connections
      var connectors = _.drop(network_interfaces);
      if(connectors.length === 0) throw 'No external network cards found';
      return q.Promise(function (resolve, reject, notify) {
        iwlist.scan(connectors[0].interface, function(error, networks) {
          if(error) reject(error);
          resolve(_.filter(networks, function(o) {
            return _.includes(o.ssid, 'meshnet_') && o.ssid !== 'meshnet_'+network_interfaces[0].address;
          }));
        });
      }).then(function (data) {

        //connect to mesh connections
        if(data.length === 0) throw 'No meshnet networks found';
        return q.all(connectors.map(function (curr, index) {
          return q.Promise(function (resolve, reject, notify) {
            wpa_supplicant.enable({
              interface: curr.interface,
              ssid: data[index].ssid,
              driver: 'wext'
            }, function(error) {
              if(error) reject(error);
              resolve(data[index].ssid);
            });
          });
        }));

      });
    });
  });
};


module.exports = setup;