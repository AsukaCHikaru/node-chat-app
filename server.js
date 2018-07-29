//import dependencies
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

//client side static files
app.use(express.static('public'));
//initialize user object
let users = {};

io.on('connection', (socket) => {
  console.log(`User ${socket.id} has connected`);  
  //add new user object by socket.id
  users[socket.id] = {socket: socket};  
    
  //disconnection handling
  socket.on('disconnect', (socket) => {    
    for (const socket in users) {
      if(users[socket].socket.disconnected){
        console.log(`User ${users[socket].socket.id} has disconnected`);            
        //if only user has logged in(decided username), broadcast logout message
        if(users[socket].hasOwnProperty('username')) io.emit('logout', users[socket].username, socket.substring(0,6));
        //delete disconnected user from users object
        delete users[socket];
      } 
    }
  });

  //when user logged in(decided username), save it to users object and broadcast login message
  socket.on('login', (username) => {
    io.emit('login', username, socket.id.substring(0,6));
    users[socket.id].username = username;    
  });

  //message sent
  socket.on('send message', (msg) => {
    //loop over every user in users object. if user id is same, identify it as my message.
    //else, identify it as others message
    Object.keys(users).forEach((socketid) => {
      if(socket.id == socketid){        
        eventid = 'my message';
      }else{
        eventid = 'others message'
      }
      //broadcast message to everyone in chatroom
      if(users[socketid].hasOwnProperty('username')){
        io.to(socketid).emit(eventid, users[socket.id].username, msg);
      }
    });
  })
});

const port = 3000;

http.listen(port, () => {
  console.log(`Listen on ${port}`);  
});