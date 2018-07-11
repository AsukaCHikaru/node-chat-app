var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
let users = {};

io.on('connection', (socket) => {
  console.log(`User ${socket.id} has connected`);  
  users[socket.id] = {socket: socket};  
    
  socket.on('disconnect', (socket) => {    
    for (const socket in users) {
      if(users[socket].socket.disconnected){
        console.log(`User ${users[socket].socket.id} has disconnected`);            
        if(users[socket].hasOwnProperty('username')) io.emit('logout', users[socket].username, socket.substring(0,6));
        delete users[socket];
      } 
    }
  });

  socket.on('login', (username) => {
    io.emit('login', username, socket.id.substring(0,6));
    users[socket.id].username = username;    
  });

  socket.on('send message', (msg) => {
    // console.log(`${socket.id} sended message: ${msg}`);
    
    Object.keys(users).forEach((socketid) => {
      if(socket.id == socketid){        
        eventid = 'my message';
      }else{
        eventid = 'others message'
      }
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