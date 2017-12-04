var q = require('q');
var _ = require('lodash');
var ifconfig = require('wireless-tools/ifconfig');
var hostapd = require('wireless-tools/hostapd');
var iwlist = require('wireless-tools/iwlist');



q.Promise(function (resolve, reject, notify) {
  //get list of interfaces
  ifconfig.status(function(error, status) {
    if(error) reject(error);
    resolve(_.slice(status, _.findIndex(status, {interface: 'lo'})+1));
  });
}).then(function (network_interfaces) {
  console.log(network_interfaces);

  //setup access point
  return q.Promise(function (resolve, reject, notify) {
    hostapd.enable({
      channel: Math.floor(Math.random()*(10-1+1)+1),
      hw_mode: 'g',
      interface: network_interfaces[0].interface,
      ssid: 'meshnet_'+network_interfaces[0].address
      //wpa: 2,
      //wpa_passphrase: 'password'
    }, function(error) {
      if(error) reject(error);
      resolve();
    });
  }).then(function (data) {
    //scan for mesh connections
    var connectors = _.drop(network_interfaces);
    return q.Promise(function (resolve, reject, notify) {
      iwlist.scan(connectors[0].interface, function(error, networks) {
        if(error) reject(error);
        resolve(_.filter(networks, function(o) {
          return _.includes(o.ssid, 'meshnet_');
        }));
      });
    }).then(function (data) {
      if(data.length < 1) throw 'No meshnet networks found';
      //connect to mesh connections
      return q.all(connectors.map(function (curr, index) {

      }));
    });
  });
}).catch(function (error) {
  console.log('ERROR: ' + error);
});