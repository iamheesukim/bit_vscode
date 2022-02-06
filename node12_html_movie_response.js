//1014
var http = require('http');
var fs = require('fs');
var mime = require('Mime');

var server = http.createServer((request,response) => {
    var mapping = request.url; // /html, /images/com.jpg, /movie/WildLife.mp4
    if(mapping == '/html') {
        fs.readFile(__dirname+'/movie_play.html','utf-8',function(e, data) {
            if(!e) { //에러가 아니면
                response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                response.end(data);
            }
            
        });
    }else if(mapping.indexOf('/images')==0) {//이미지 접속
        var mimeName = mime.getType(mapping.substring(1));
        console.log("mimeType->"+mimeName);

        fs.readFile(__dirname+mapping, function(e,imgData){
            if(!e) {
                response.writeHead(200, {'Content-Type':mimeName});
                response.end(imgData);
            }
        });
    } else if(mapping.indexOf('/movie')==0) { //동영상 접속
        //1.streaming 처리하는 객체 생성
        var stream = fs.createReadStream(mapping.substring(1));

        var cnt = 1;

        //2.데이터 읽었을 때 처리할 이벤트
        stream.on('data', function(data) {
            response.write(data);
            console.log(cnt++ + '번째, dataSize='+data.length);
        });

        //3.남은 데이터가 마지막일 때 처리할 이벤트
        stream.on('end',function() {
            response.end();
            console.log("end stream~");
        });

        //4.데이터 읽기 에러가 발생 시 처리할 이벤트
        stream.on('error',function() {
            response.end();
            console.log("error stream~");
        });
    } else {
        response.writeHead(404, {'Content-type':'text/html; charset=utf-8'});
        response.end("404 error page~");
    }
});

server.listen(10008, function() {
    console.log('server start~ http://127.0.0.1:10008/html');
});
