var _ = require('lodash');
var dgram = require('dgram');
var client = dgram.createSocket("udp4");
var inquirer = require('inquirer');
var shortid = require('shortid');

var BROADCAST_ADDR = '255.255.255.255';
var PORT = 6024;

//log user metadata to ignore repetitive messages
var userLog = [];

var uid = shortid.generate(); //unique id
var name = ''; //user generated name

//Listen to broadcast messages from other users
client.on('message', function(message, info){
  try{
    //parse JSON string
    var parsed = JSON.parse(message);

    //ignore own messages and repetitive messages
    if(name !== parsed.name && !_.some(userLog, { uid: parsed.uid, timestamp: parsed.timestamp})){

      //update userLog with newest message timestamp
      userLog = _.filter(userLog, function(o) {
        return o.uid !== parsed.uid;
      }).concat([{uid: parsed.uid, timestamp: parsed.timestamp}]);

      //log user message to terminal
      console.log(parsed.name + ': ' + parsed.message);
    }
  }catch(e) {
    //IGNORE: failed to parse message
  }
});

//bind port to listen for new broadcast messages from clients
client.bind(PORT, function() {
  client.setBroadcast(true);
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
    //set user's name
    name = data.name;

    //get user message to broadcast
    getMessage();
  }).catch(function (error) {
    //if an error occurs, log error and exit program
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
    //broadcast user's message
    broadcastMessage(data.message);

    //get new user message to broadcast
    getMessage();
  }).catch(function (error) {
    //if an error occurs, log error and exit program
    console.error(error);
    process.exit(0);
  });
};

//broadcast message
var broadcastMessage = function (data) {
  //build message
  var message = new Buffer(JSON.stringify({
    uid: uid,
    timestamp: Math.round((new Date()).getTime() / 1000),
    name: name,
    message: data
  }));

  //broadcast UDP message
  client.send(message, 0, message.length, PORT, BROADCAST_ADDR);
};

//start program, get name of user
setName();
