//1012
//nodejs : 이벤트기반 서버 프레임워크

//1. 서버를 생성하기 위해서는 http 모듈을 객체 생성한다.
var http = require('http');

//서버를 생성하는 함수를 http 객체를 통해서 구현한다.
var server = http.createServer(function(request, response) {
	//response : 저복한 클라이언트에게 정보 보내기
	
	//1.response에 Head 정보를 설정
	response.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});

	//2.response 컨텐츠 보내기
	response.write("<h1>노드에서 보낸 문자</h1>");
	response.write("http 모듈을 이용한 서버 접속 테스트 중...<br/>");

	//3.response에 종료를 설정한다
	response.end("마지막 내용");
});

//클라이언트의 접속대기
//	port, 콜백함수
server.listen(9999,function() {
	console.log("server in running... http://127.0.0.1:9999");
});