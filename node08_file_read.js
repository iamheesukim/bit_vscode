//1013
//파일 읽기/쓰기를 처리하는 모듈
var fs = require('fs');

//파일을 처리하기 위해서는 절대주소가 필요하다.

//비동기식으로 파일 읽는 방법 : 읽기,쓰기 명령을 바로 실행하지 않고 스레드로 처리된다.

//          읽을 파일명(절대주소)           인코딩      콜백함수:파일의 내용을 읽고나면 호출되는 함수 
fs.readFile(__dirname+'/file_read.txt', 'utf-8', function(error, data){
//                                                       에러     읽은내용
    console.log("파일1 : 비동기식 읽기 ==========================");
    console.log(data);
});

//동기식으로 파일 읽는 방법 : 읽기, 쓰기를 명령어를 만나면 바로 실행한다.
//읽은내용
var data = fs.readFileSync(__dirname+'/node01_start.js','utf-8');
console.log("파일2 : 동기식 읽기 ==========================");
console.log(data);