//1013
var http = require('http');

//웹브라우저에 파일로 있는 이미지 표시하기
var fs = require('fs');

var server = http.createServer(function(request, response) {
    fs.readFile(__dirname+'/images/com.jpg',function(error, data) {
        console.log(data);
        //이미지로 클라이언트에 쓰기
        response.writeHead(200, {'Content-Type':'image/jpeg'});
        response.write(data);
        response.end();
    });
});

server.listen(10006,function() {
    console.log('server start... http://localhost:10006');

});