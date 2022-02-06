var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
    fs.readFile(__dirname+'/chat_form_02.html','utf-8',function(error, data){
        res.writeHead(200, {"Content-Type":"charset=utf-8"});
        res.end(data);
    });
});

server.listen(10014, function(){
    console.log('server start.... http://127.0.0.1:10014');
});

////////////////////////////
var socketio = require('socket.io');

var io = socketio.listen(server);
io.sockets.on('connection',function(socket){

    //방 만들기
    var roomName;
    socket.on('join',function(roomNameReceive){
        roomName = roomNameReceive;
        //방 이름을 socket객체 join한다.
        socket.join(roomName);
    });
    //메시지
    socket.on('message',function(data){
        io.sockets.in(roomName).emit('response',roomName+"->"+data);
    });
});