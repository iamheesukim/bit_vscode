//1015
//[broadcast 통신방법 : 나를 제외한 모든 접속자에게 데이터 보내기]

var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

var server = http.createServer((req,res)=> {
    if(req.url=='/chartEcho') {
        fs.readFile(__dirname+'/chat_form_01.html','utf-8',(e,d)=> {
            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
            res.end(d);
        });
    }else{

    }
}).listen(10012, ()=> {
    console.log('server start! http://127.0.0.1:10012/chartEcho');
});

//=========통신프로그램 구현==========
//1) 소켓 서버를 생성하고 실행
var io = socketio.listen(server);

//2)접속을 대기하는 이벤트를 생성('connection 이벤트가 발생하면 실행될 곳')
io.sockets.on('connection', function(socket) {

    //3)클라이언트가 보낸 문자를 받을 이벤트
    socket.on('hello',function(msg){
        console.log("서버가 받는 문자 : "+msg);

        //4)클라이언트에게 서버가 정보 보내는 이벤트 발생
        //[1]서버와 클라이언트와 1:1 통신
        //socket.emit('echo', 'server message : '+msg);
        //[2]서버와 접속한 모든 클라이언트 통신하기
        //io.sockets.emit('echo','public=>'+msg);
        //[3]broadcast 통신방법 : 나를 제외한 모든 접속자에게 데이터 보내기
        socket.broadcast.emit('echo','broadcast -> '+msg);
    });
});