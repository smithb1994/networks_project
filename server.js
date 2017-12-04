var dgram = require('dgram');
var server = dgram.createSocket("udp4");
var netmask = require('netmask').Netmask;
var ip = require('ip');

var block = new netmask(ip.address() + '/24');
var BROADCAST_ADDR = block.broadcast;
var PORT = 6024;

server.bind(function() {
  server.setBroadcast(true);
  setInterval(function() {
    broadcastMessage('New Broadcast Message');
  }, 3000);
});

function broadcastMessage(data) {
  var message = new Buffer(data);
  server.send(message, 0, message.length, PORT, BROADCAST_ADDR, function() {
    console.log("Sent '" + message + "'");
  });
}