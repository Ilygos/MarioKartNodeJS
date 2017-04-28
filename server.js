//Serveur de Mario Kart (c)Maxence Beaumont 2017

const EXPRESS = require('express');
const APP = EXPRESS();
const HTTP = require('http').Server(APP);
const IO = require('socket.io')(HTTP);

var users = [];
IO.on('connection', function(pSocket)
{
  users.push(pSocket);
  console.log('A user has join the server');
  pSocket.emit('news', { hello: 'world' });
  pSocket.on('disconnect', function()
  {
    console.log('A user has left the server');
  });
  pSocket.on('send', function(send)
  {
    pSocket.broadcast.emit('recieved', send);
  })
});

APP.use(EXPRESS.static('./public'));

HTTP.listen(30000);
