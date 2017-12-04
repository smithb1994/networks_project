# Networks Project

This is the code for our final project for CPE 400. The idea is to build a localized version of IRC.
On the network, we will set up "relays" and "clients." Clients will send messages to each other, and
receive all messages sent on the network. The relays will broadcast all messages that they
receive so that all clients get them.


**Disclaimer**
This is not a secure application, and was not designed with security in mind whatsoever. It opens
up a UDP port and uses that to broadcast messages on the network, so likely not very secure.
If you have just stumbled upon this, then you probably don't want to try it out. 


## Setup   
* Install dependencies  
`$ npm install`

## Run  
You're either gonna want to run a relay, or run a client on the network.
Follow the command below corresponding to what you would like to do. Hopefully we
will package this in some sort of less manual cli of some sort before turning it in.

* run relay
`$  node server.js`

* run client
`$  node client.js`  
