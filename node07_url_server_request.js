//1013
var http = require('http');
var url = require('url');

// [[ 노드 전체 영역의 전역변수 ]]

var server = http.createServer(function(req, res) {
    //  address:주소 / name:이름 / tel:연락처 를 그외의 주소로 접속을 하면 에러메시지를 보내줌.

    //1.실제 접속한 주소
    console.log("실제접속주소(req,res) : "+req.url); //http://127.0.0.1:10005/address

    /*
    var urlParsing = url.parseUrl(req.url);
    console.log("parseUrl : "+urlParsing);

    var pathName = parseUrl.pathName;
    console.log('pathName : '+ pathName);
    */

    var pathName = req.url;

    if(pathName == '/address') {

        console.log('__filename : '+__filename);
        console.log('__dirname : '+__dirname);

        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
        res.end("<h1>주소 : 서울시 마포구 백범로</h1>");

    } else if(pathName == '/name') {
        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
        res.end("<h1>이름 : 홍길동</h1>");

    } else if(pathName == '/tel') {
        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
        res.end("<h1>연락처 : 010-9999-8888</h1>");

    } else {
        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
        res.end("<h1>404 Page Not Found...</h1>");
    }

});

server.listen(10005, function() {
    console.log('__filename : '+__filename);
    console.log('__dirname : '+__dirname);

    console.log('server start... http://127.0.0.1:10005');
    console.log('server start... http://127.0.0.1:10005/address');
    console.log('server start... http://127.0.0.1:10005/name');
    console.log('server start... http://127.0.0.1:10005/tel');
});