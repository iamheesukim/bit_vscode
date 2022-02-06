//1013
var http = require('http');

// 1. 이벤트가 정의되어 있는 events 모듈을 객체화해야 한다.
var events = require('events');

var cnt = 1;
// 2. 이벤트 처리를 하기 위해서는 모듈을 담고 있는 객체(EventEmitter)를 초기화해야 한다.
var event_object = new events.EventEmitter();

// 이벤트 발생시 실행할 함수를 정의
// on(), addListener(), once()
//          이벤트 이름, 이벤트 발생 시 실행할 함수
/*
event_object.on('call', ()=>{ // 이벤트 발생 시 2번 호출됨
    console.log('on(call) events => ' + cnt++);
});

event_object.addListener('call', function() { //이벤트 발생시 2번 호출됨
    console.log('addListener(call) => ' + cnt++);
});
*/

event_object.once('call', ()=> { //이벤트 발생시 1번 호출됨
    console.log('once(call) => ' + cnt++)
});

var server = http.createServer((request, response)=>{
    // 이벤트가 강제발생
    event_object.emit('call'); // call이라는 이벤트 발생시키기

    response.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    response.end('<h1>사용자이벤트 테스트 중</h1>');
});

server.listen(10004, ()=>{
    console.log('http://127.0.0.1:10004');
});