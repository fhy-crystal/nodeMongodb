var express = require('express'); // 引入express
var bodyParser = require('body-parser'); // 引入body-parser
var MongoClient = require('mongodb').MongoClient; // 引入mongodb
var app = express();
var URL = 'mongodb://172.16.10.215:27017/nodeMongoDB'; // 连接到数据库
//json编码
app.use(bodyParser.json());

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE");
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

// 插入数据
var insertData = function(data, db, callback) {  
	//连接到表  
	var collection = db.collection('nodeMongoTable');
	//插入数据
	// var data = [{"name":'wilson001',"age":21},{"name":'wilson002',"age":22}];
	collection.insert(data, function(err, result) { 
		if(err) {
			console.log('Error:'+ err);
			return;
		}	 
		callback(result);
	});
}

// 查询数据
var queryData = function(db, callback) {
	//连接到表  
	var collection = db.collection('nodeMongoTable');
	collection.find().toArray(function(err, result) {
		if(err) {
		  console.log('Error:'+ err);
		  return;
		}
		callback(result);
  });
}

// 插入数据
app.post('/postTest', function(req, res){
	// req.body 获取json格式传递的参数
	console.log(req.body);
	// 调用mongo插入数据方法
	MongoClient.connect(URL, function(err, db) {
		console.log("连接成功！");
		insertData(req.body, db, function(result) {
			res.end(JSON.stringify(result));
			db.close();
		});
	});
})

// 查询
app.get('/query', function(req, res) {
	// 调用mongo查询数据方法
	MongoClient.connect(URL, function(err, db) {
		console.log('连接成功');
		queryData(db, function(result) {
			res.end(JSON.stringify(result));
			db.close();
		})
	})
})

//监听8081接口打印请求域名和端口
var server = app.listen(8081, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log("应用实例，访问地址为 http://%s:%s", host, port);

})