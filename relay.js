var _ = require('lodash');
var os = require('os');
var dgram = require('dgram');
var client = dgram.createSocket("udp4");
var network_one = dgram.createSocket("udp4");
var network_two = dgram.createSocket("udp4");

var BROADCAST_ADDR = '255.255.255.255';
var LISTEN_PORT = 6024;
var RELAY_PORT = 6025;

//get current IPv4 addresses from adapters connected to the computer
var IPv4_Addresses = _.map(_.values(_.omit(os.networkInterfaces(), 'lo')), function(o){
  return o[0].address;
});

//IP addresses of the two network interfaces on the device
var IP_NETWORK_ONE = IPv4_Addresses[0]; //eg: 192.168.1.123
var IP_NETWORK_TWO = IPv4_Addresses[1]; //eg: 192.168.1.203

//Listen to broadcast messages
client.on('message', function(message, info){
  //console log message to terminal, for debugging
  console.log(message.toString());

  //relay received message to both networks
  network_one.send(message, 0, message.length, RELAY_PORT, BROADCAST_ADDR);
  network_two.send(message, 0, message.length, RELAY_PORT, BROADCAST_ADDR);
});


//bind listening port, to listen for new broadcast messages
client.bind(LISTEN_PORT, function() {
  client.setBroadcast(true);
});

//bind first networks port, to broadcast to network one
network_one.bind(RELAY_PORT, IP_NETWORK_ONE, function () {
  network_one.setBroadcast(true);
});

//bind second networks port, to broadcast to network two
network_two.bind(RELAY_PORT, IP_NETWORK_TWO, function () {
  network_two.setBroadcast(true);
});
