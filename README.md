# Networks Project

**DEMO VIDEO:**
[https://youtu.be/o-y0IWdzlZk](https://youtu.be/o-y0IWdzlZk)

This is the code for our final project for CPE 400. The idea is to build a localized version of IRC.
On the network, we will set up "relays" and "clients." Clients will send messages to each other, and
receive all messages sent on the network. The relays will broadcast all messages that they
receive so that all clients get them between different network connections. The idea is that if users are connected 
to the same access point, they can talk to each other using UDP broadcasts. Relays connect between multiple wifi access 
points, relaying to both networks allowing users to communicate even if they are on different networks.


## Setup   
* Make sure you are running a linux or Mac computer  
* Install node.js on your system [https://nodejs.org/en/](https://nodejs.org/en/)  
* Install dependencies  
`$ cd networks_project`  
`$ npm install`  

## Run Client  
Make sure your firewall is down before running. Connect to a wifi network that allows you
to broadcast UDP messages (UNR network may have issues).

Run client  
`$ node client.js`  
  
Enter a name that you want to display to other users in the chat.  
Start messaging to other users with their client running.  
  
## Run Relay  
Make sure your firewall is down before running. Make sure you have **TWO** wifi cards connected to the computer, either 
through USB or from an internal wifi card. Connect one wifi card to one network, and then another wifi card to the other. 
The relay will be relaying the broadcast messages from one network to the other. This allows a user to communicate on one 
network, and then a user on another network to receive it.  
  
Run relay  
`$ node relay.js`  
  
The relay will now run and output to the terminal the messages it relays between the wifi networks.
