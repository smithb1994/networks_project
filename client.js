var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var inquirer = require('inquirer');

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
    console.log('YOUR NAME IS: ', name);
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
      message: 'Jack: '
    }
  ]).then(function (data) {
    // !!! NOT COMPLETE
    //  - Broadcast message to networkj
    //  - Re-open prompt for another message
    //      - Possibly will need to manage buffer so that incoming messages don't
    //        over-run the prompt


    getMessage();
  }).catch(function (error) {
    // Otherwise output the error and exit the program
    console.error(error);
    process.exit(0);
  });
};


setName();
