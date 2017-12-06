var _ = require('lodash');
var os = require('os');
var dgram = require('dgram');
var client = dgram.createSocket("udp4");
var network_one = dgram.createSocket("udp4");
var network_two = dgram.createSocket("udp4");

var BROADCAST_ADDR = '255.255.255.255';
var PORT = 6024;

//log user metadata to ignore repetitive messages
var userLog = [];

//get current IPv4 addresses from adapters connected to the computer
var IPv4_Addresses = _.map(_.values(_.omit(os.networkInterfaces(), 'lo')), function(o){
  return o[0].address;
});

//IP addresses of the two network interfaces on the device
var IP_NETWORK_ONE = IPv4_Addresses[0]; //eg: 192.168.1.123 (WIFI network one)
var IP_NETWORK_TWO = IPv4_Addresses[1]; //eg: 192.168.1.203 (WIFI network two)

//starting relay message
console.log('==================');
console.log('= Starting relay =');
console.log('==================');

//Listen to broadcast messages
client.on('message', function(message, info){
  try{
    //parse JSON string
    var parsed = JSON.parse(message);

    //check if message has already been logged
    if(!_.some(userLog, { uid: parsed.uid, timestamp: parsed.timestamp})){
      //log user message to terminal
      console.log(message.toString());

      //update userLog with newest message timestamp
      userLog = _.filter(userLog, function(o) {
        return o.uid !== parsed.uid;
      }).concat([{uid: parsed.uid, timestamp: parsed.timestamp}]);

      //relay received message to both networks
      network_one.send(message, 0, message.length, PORT, BROADCAST_ADDR);
      network_two.send(message, 0, message.length, PORT, BROADCAST_ADDR);
    }
  }catch(e) {
    //IGNORE: failed to parse message
  }
});


//bind listening port, to listen for new broadcast messages
client.bind(PORT, function() {
  client.setBroadcast(true);
});

//bind first network, to broadcast to network one
network_one.bind(null, IP_NETWORK_ONE, function () {
  network_one.setBroadcast(true);
});

//bind second network, to broadcast to network two
network_two.bind(null, IP_NETWORK_TWO, function () {
  network_two.setBroadcast(true);
});
