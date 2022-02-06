//1013
var http = require('http');

// 사용자 정의 모듈 사용하기

var myModule = require('./node04_custom_module_create');

var server = http.createServer(function(request,response) {
    
    response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    response.write('번호='+myModule.num);
    response.write('<br/>이름='+myModule.username);
    response.write('<br/>hap(50,60) => '+myModule.hap(50,60));
    response.write('<br/>sum(100) => '+myModule.sum(100));
    response.end('<br/>gugudan(8) => '+myModule.gugudan(8));

});

server.listen(10003, function() {
    console.log("http://127.0.0.1:10003");
});