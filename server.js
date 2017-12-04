var dgram = require('dgram');
var server = dgram.createSocket("udp4");
var ifconfig = require('wireless-tools/ifconfig');
var setup = require('./setup.js');

var connected_networks = [];

//setup access point and connect to mesh network
setup.run().then(function (data) {
  connected_networks.concat(data);
  console.log(data);
}).catch(function (error) {
  console.log(error);
});


ifconfig.status(function(err, status) {
  console.log(status);
});

/*
server.bind(function() {
  server.setBroadcast(true);
  setInterval(function() {
    broadcastMessage('New Broadcast Message');
  }, 3000);
});

function broadcastMessage(data) {
  var message = new Buffer(data);
  server.send(message, 0, message.length, 6024, BROADCAST_ADDR, function() {
    console.log("Sent '" + message + "'");
  });
}
*/
