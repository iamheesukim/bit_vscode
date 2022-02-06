//1012
//모듈 객체
var http=require('http');

// 접속한 url주소를 객체화 하는 모듈 (도메인,port,폴더명,파일명,변수,데이터)
var url = require('url');

//--url과 함께 있는 변수와 데이터를 구하기 위해서 필요한 모듈
var querystring = require('querystring');

//서버 생성
var server = http.createServer((request,response)=>{

	//1)클라이언트의 접속정보가 있는 url주소를 url모듈을 이용하여 파싱한다.
	console.log('request.url->'+request.url);
	var parseUrl = url.parse(request.url);
	console.log('parseUrl->'+parseUrl);

	//2) querystring모듈을 이용하여 클라이언트 측에서 보내온 변수와 데이터를 파싱한다.
	var parseQuery = querystring.parse(parseUrl.query,'&','=');
	console.log(parseQuery);

	//클라이언트에게 정보 보내기
	response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	response.write("이름 = "+parseQuery.name+"<br/>");
	response.write("나이 = "+parseQuery.age+"<br/>");
	response.write("연락처 = "+parseQuery.tel+"<hr/>");
	//response.end("연락처 = "+parseQuery.tel+"<hr/>");

	//post 전송 방식의 폼 만들기
	response.write("<form method='post' action='http://127.0.0.1:10002'>");
	response.write("아이디 : <input type='text' name='userid'/><br/>");
	response.write("비밀번호 : <input type='password' name='userpwd'/><br/>");
	response.write("<input type='submit' value='로그인'/>");
	response.end("</form>");
});

//접속 대기
server.listen(10001,()=>{
	console.log("server start... http://127.0.0.1:10001/?name=홍길동&age=30&tel=010-1234-5678");
})