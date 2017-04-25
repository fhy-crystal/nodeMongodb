var express = require('express'); // 引入express
var router = express.Router();
var MongoClient = require('mongodb').MongoClient; // 引入mongodb
var URL = require('../config/DBconfig.js'); // 连接到数据库

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
var queryData = function(data, db, callback) {
	//连接到表  
	var collection = db.collection('nodeMongoTable');
	collection.find(data).toArray(function(err, result) {
		if(err) {
		  console.log('Error:'+ err);
		  return;
		}
		callback(result);
  });
}

// 删除数据
var deleteData = function(data, db, callback) {
	// 连接到表
	var collection = db.collection('nodeMongoTable');
	collection.remove(data, function(err, result) {
		if (err) {
			console.log('Error:' + err);
			return;
		}
		callback(result);
	})
}

// 规范返回格式
var responseJSON = function (res, result) {
	if(typeof res === 'undefined') { 
		res.json({
			status:'-200',
			msg: '操作失败'
		}); 
	} else {
		var finalResult = {
			status: 0,
			msg: '操作成功'
		};
		if (Array.isArray(result)) {
			finalResult.data = result;
		}
		res.json(finalResult);
	}
};


// 插入数据
router.post('/add', function(req, res){
	// req.body 获取json格式传递的参数
	console.log(req.body);
	// 调用mongo插入数据方法
	MongoClient.connect(URL, function(err, db) {
		console.log("插入连接成功！");
		var insertBody = req.body;
		insertBody['_id'] = Date.now().toString();
		insertData(insertBody, db, function(result) {
			responseJSON(res, result);
			db.close();
		});
	});
})

// 查询
router.get('/query', function(req, res) {
	// 调用mongo查询数据方法
	MongoClient.connect(URL, function(err, db) {
		console.log('查询连接成功');
		queryData({}, db, function(result) {
			responseJSON(res, result);
			db.close();
		})
	})
})

// 删除
router.post('/delete', function(req, res) {
	// req.body 获取json格式传递的参数
	console.log(req.body);
	// 调用mongo删除数据方法
	MongoClient.connect(URL, function(err, db) {
		console.log('删除连接成功');
		deleteData(req.body, db, function(result) {
			responseJSON(res, result);
			db.close();
		})
	})
})

module.exports = router;