//1015
//npm install express
//npm install oracledb
//npm install ejs
//npm install express-session
//npm install request-ip

var http = require('http');
var express = require('express');
var fs = require('fs'); //파일 입출력
var ejs = require('ejs'); //Embedded js template
var session = require('express-session'); //세션
var requestip = require('request-ip'); //접속자ip

var app = express();
var server = http.createServer(app);

/////////////////////////JDBC////////////////////////
var oracledb = require('oracledb');
oracledb.autoCommit = true; //자동커밋
var conn; //DB연결
oracledb.getConnection({
    user:'c##scott',
    password:'tiger',
    connectString:"localhost:1521/xe"},
    function(error,con) {
        //연결시 에러 발생하면 실행할 콜백함수
        if(error) {
            console.log('Db연결 error 발생 -->'+error);
        }else {
            console.log("DB연결 성공.");
            conn = con;
        }
    }
);

/////POST방식 접속 시 데이터 request를 위한 설정////
var bodyParser = require('body-parser');
const { response } = require('express');
app.use(express.static(__dirname)); //express에 기본 디렉토리 셋팅
app.use(bodyParser.urlencoded({extended:true})); //한글 인코딩 셋팅


//홈페이지로 이동하기
app.get('/home',function(req, res) {
    fs.readFile(__dirname+'/home.html','utf-8',function(e, data) {
        if(!e) {
            res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
            res.end(data);
        } 
    });
});

//로그인폼
app.get('/login',function(req,res) {
    fs.readFile(__dirname+"/loginForm.html","utf-8",function(e,data) {
        if(!e) {
            res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
            res.end(data);
        }
    });
});

//로그인
app.post('/loginOk', function(req,res){
    //아이디와 비밀번호 서버로 가져오기
    var userid = req.param('userid');
    var userpwd = req.param('userpwd');
    console.log("접속 : "+userid+" / "+userpwd);

    //아이디, 이름을 선택
    var sql = "select userid, username from register where userid='"+userid+"' and userpwd='"+userpwd+"'";
    
    conn.execute(sql, function(error, result) { //DB 처리 완료시 실행되는 곳
        //console.log('result=>'+result);
        if(result.rows.length==0) { //로그인 실패
            fs.readFile(__dirname+"/loginForm.html",'utf-8',function(e,data){
                console.log("로그인 실패");
                if(!e) {
                    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
                    res.end(data);
                }
            });

        }else { //로그인 성공
            console.log("로그인 성공");

            //세션기록
            session.user = {
                userid : result.rows[0][0],
                username : result.rows[0][1],
                autorized : true //인증받은,검정필
            };

            //
            fs.readFile(__dirname+"/home.ejs","utf-8",function(error, data) {
                if(error) {
                    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
                    res.end("404 error ㅠㅠ");
                
                }else {
                    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
                    res.end(ejs.render(data, {user:session.user, logStatus:'Y'}));
                }
            })
        }
    });
});

//로그아웃
app.get('/logout',function(req,res){
    if(session.user){//세션에 정보가 있으면 로그인 상태
        fs.readFile(__dirname+'/home.ejs','utf-8',function(error,data) {
            if(!error){
                session.user = null; //세션지우기
                res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
                res.end(ejs.render(data,{logStatus:'N'}));
                console.log("로그아웃 성공");
            }
        })
    } else {
        console.log("로그아웃 상태");
    }
});


//게시판 리스트
app.get('/list',(req, res)=>{
    var sql ="select no, subject, userid, hit, writedate from board order by no desc";
    //쿼리문 실행
    conn.execute(sql, (error, result)=>{
        //result.rows.length : 선택한 레코드 수
        var totalRecord = result.rows.length;
        if(result.rows.length>0){//선택한 레코드가 있다.
            fs.readFile(__dirname+'/list.ejs','utf-8',(error, data)=>{
                res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
                res.end(ejs.render(data,{records: result,
                                        totalRecord: totalRecord,
                                        startPage:6,
                                        onePageRecord:5}));

            });
        }
    });
});

//글쓰기 폼
app.get('/writeFrm',(req, res)=>{
    fs.readFile(__dirname+'/writeFrm.ejs','utf-8',function(e,d){
            if(!e){
                res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
                res.end(d);
            }

    });
});

//글쓰기 완료
app.post('/writeOk',(req, res)=>{
    var userid= req.param('userid');
    var subject= req.param('subject');
    var content= req.param('content');
    //클라이언트 ip

    var ip = requestip.getClientIp(req).substring(7); //      :: ffff :127.0.0.1  f 없애는 작업

    var sql ="insert into board (no, subject, content, userid, hit, writedate, ip )";
        sql += " values(boardsq.nextval, :subject, :content, :userid, 0, sysdate, :ip)";
    //바인딩 할 데이터를 배열로 만들어서 1차원함수 
    var bindData=[subject, content, userid, ip];
    //자바 스크립트는 다양하게 넣을 수 있다. 
        conn.execute(sql, bindData, function(error, result){
            // rowsAffected:insert문의 추가된 레코드수  1이면 1개insert를 했다.
            if (error || result.rowsAffected==0){
                //글쓰기로 이동
               res.redirect("/writeFrm");

            }else{
                //목록

            res.redirect("/list");
            }

        });
});

     

// 해당글 선택 + 조회수 증가
app.get('/view', function(request, response){
    console.log(123);
    var no = request.param('no');
    console.log('no->' + no);
    // 조회수 증가
    var sql = "update board set hit=hit+1 where no=:no";
    var bindData = [no];
    conn.execute(sql, bindData, function(error, result){
        console.log('조회수->' + result);
    });

        // 레코드 선택
        sql = "select no, subject, DBMS_LOB.SUBSTR(content, DBMS_LOB.GETLENGTH(content)), userid, ip, hit, to_char(writedate, 'YYYY-MM-DD HH:MI:SS')";
        sql += " from board where no=:no";
        console.log('실행확인');
        conn.execute(sql, bindData, function(error, result){
            console.log('결과' + result);
            if(error){
                response.redirect('/list');
            } else{
                fs.readFile(__dirname + '/view.ejs', 'utf-8', function(error, data){
                    response.writeHead(200, {'Content-Type':'text/html;Charset=utf-8'});
                    response.end(ejs.render(data, {results : result}));
                });
            }
        });


});

//수정(폼)
app.get('/writeEdit', function(req, res){
    var no = req.param('no');
    
    var bindData = [no];
   
    var sql="select no, subject, DBMS_LOB.SUBSTR(content,DBMS_LOB.GETLENGTH(content)), userid, ip, hit, to_char(writedate, 'YY-MM-DD') writedate from board where no=:no";
    conn.execute(sql, bindData, function(error,result){
      
        if(error){
            res.redirect('/list');
        }else{
            fs.readFile(__dirname+'/editOk.ejs','utf-8',(e,d)=>{
                if(!e){
                    res.writeHead(200, {'Content-Type':'text/html;Cahrset=utf-8'});
                    res.end(ejs.render(d,{list:result}));
                }
            });
           
        }

    });
});

//수정(전송)
app.post('/writeEditOk', function(req, res){
    var no = req.param('no');
    
    var subject = req.param('subject');
    var content= req.param('content');
    console.log(no);
    console.log(subject);
    console.log(content);

    var bindData = [subject, content, no];

    var sql="update board set subject=:subject, content=:content where no=:no";
    conn.execute(sql, bindData, function(error,result){
      
        if(error){
            res.redirect('/list');
        }else{
            res.writeHead(302, {'Location':'/view?no='+no});
            res.end()
           
        }

    });

});

//삭제
app.get('/writeDelete', function(req, res){
    var no = req.param('no');
    
    var bindData = [no];
   
    var sql="delete from board where no=:no";
    conn.execute(sql, bindData, function(error,result){
        res.redirect('/list');
    });

});


server.listen('10020', function(){
    console.log('start server..... http://127.0.0.1:10020/home');
});