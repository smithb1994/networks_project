var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var inquirer = require('inquirer');
var netmask = require('netmask').Netmask;
var ip = require('ip');
var block = new netmask(ip.address() + '/24');
var BROADCAST_ADDR = block.broadcast;


var PORT = 6024;
var name = '';

client.on('listening', function () {
  var address = client.address();
  client.setBroadcast(true);
});


// !!! NOT COMPLETE
//  - Need to upgrade so that name of person sending message is maintained in message
//    ( and timestamp? )
client.on('message', function (message, rinfo) {
  console.log('Message from: ' + rinfo.address + ':' + rinfo.port +' - ' + message);
});

client.bind(PORT);


var setName = function() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Entering Local Chat, what is your name?\n'
    }
  ]).then( function (data) {
    name = data.name;
    getMessage();
  }).catch(function (error) {
    console.error(error);
    process.exit(0);
  });
};

var getMessage = function() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: name + ': '
    }
  ]).then(function (data) {
    client.setBroadcast(true);
    broadcastMessage(data.message);
    getMessage();
  }).catch(function (error) {
    // Otherwise output the error and exit the program
    console.error(error);
    process.exit(0);
  });
};

var broadcastMessage = function (data) {
  var message = new Buffer(data);
  client.send(message, 0, message.length, 6024, BROADCAST_ADDR, function() {
    console.log("Sent '" + message + "'");
})};


setName();
