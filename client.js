var dgram = require('dgram');
var client = dgram.createSocket("udp4");
var relay = dgram.createSocket("udp4");
var inquirer = require('inquirer');

var BROADCAST_ADDR = '255.255.255.255';
var LOCAL_PORT = 6024;
var RELAY_PORT = 6025;
var name = '';

//Listen to broadcast messages from other users
client.on('message', function(message, info){
  try{
    //parse JSON string
    var parsed = JSON.parse(message);

    if(name !== parsed.name){
      //log user message to terminal
      console.log(parsed.name + ': ' + parsed.message);
    }
  }catch(e) {
    //IGNORE: failed to parse message
  }
});

//Listen to broadcast messages from relays
relay.on('message', function(message, info){
  try{
    //parse JSON string
    var parsed = JSON.parse(message);

    if(name !== parsed.name){
      //log user message to terminal
      console.log(parsed.name + ': ' + parsed.message);
    }
  }catch(e) {
    //IGNORE: failed to parse message
  }
});

//bind port to listen for new broadcast messages from clients
client.bind(LOCAL_PORT, function() {
  client.setBroadcast(true);
});

//bind port to listen for new broadcast messages from relays
relay.bind(RELAY_PORT, function() {
  relay.setBroadcast(true);
});

//get name from user
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

//get new message from user
var getMessage = function() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: name + ': '
    }
  ]).then(function (data) {
    broadcastMessage(data.message);
    getMessage();
  }).catch(function (error) {
    // Otherwise output the error and exit the program
    console.error(error);
    process.exit(0);
  });
};

//broadcast message
var broadcastMessage = function (data) {
  var message = new Buffer(JSON.stringify({ name: name, message: data }));
  client.send(message, 0, message.length, LOCAL_PORT, BROADCAST_ADDR);
};

//start program, get name of user
setName();
