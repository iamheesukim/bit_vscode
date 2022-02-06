//1013
//파일로 쓰기
//fs : File System

var fs = require('fs');

var dataAsync = "비동기식으로 파일 쓰기 연습중\r\n줄바꿈 확인하기"

//비동기식으로 쓰기 : 스레드가 실행
//          경로+파일명,                        쓸 내용     인코딩    콜백함수
fs.writeFile(__dirname+'/file_write_async.txt', dataAsync, 'utf-8', function(error){
    if(error) { //error에 메시지가 있으면 true (에러 발생)
    console.log("비동기식으로 파일쓰기 실패"+error);

    } else {
        console.log("비동기식으로 파일쓰기 완료");
    }
});

//동기식으로 쓰기
var dataSync = "동기식으로 file write test";

//동기식엔 콜백함수 없음, 대신 예외처리!
try {
    fs.writeFileSync(__dirname+'/file_write_sync.txt', dataSync,'utf-8');
    console.log("동기식으로 파일 쓰기 성공");
} catch(error) {
    console.log("동기식으로 파일 쓰기 실패"+error);
}
