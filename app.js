// 引入路由文件
var index = require('./routes/index.js');
var edit = require('./routes/edit.js');

var express = require('express'); // 引入express
var bodyParser = require('body-parser'); // 引入body-parser
var app = express();


//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE");
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

//json编码
app.use(bodyParser.json());


app.use('/', index); // 当路径为'/'，即'http://localhost:8081/'时，匹配index.js
app.use('/edit', edit); // 当路径为'/edit',即'http://localhost:8081/edit'时，匹配edit.js

// 匹配404，即路径未匹配时
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})

// 当路径匹配错误时
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//监听8081接口打印请求域名和端口
var server = app.listen(8081, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log("应用实例，访问地址为 http://%s:%s", host, port);

})