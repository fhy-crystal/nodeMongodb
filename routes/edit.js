var express = require('express'); // 引入express
var router = express.Router();
var MongoClient = require('mongodb').MongoClient; // 引入mongodb
var URL = require('../config/DBconfig.js'); // 连接到数据库

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

// 编辑数据
var editData = function(data, changeData, db, callback) {
	// 连接到表
	var collection = db.collection('nodeMongoTable');
	collection.update(data, {'$set': changeData}, function(err, result) {
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

// 查询单个
router.post('/queryone', function(req, res) {
	// 调用mongo查询数据方法
	MongoClient.connect(URL, function(err, db) {
		console.log('查询单个连接成功');
		queryData(req.body, db, function(result) {
			responseJSON(res, result);
			db.close();
		})
	})
})

// 更改
router.post('/update', function(req, res) {
	// 调用mongo更新数据方法
	MongoClient.connect(URL, function(err, db) {
		console.log('更新连接成功');
		var findData = {
			'_id': req.body['_id']
		};
		editData(findData, req.body, db, function(result) {
			responseJSON(res, result);
			db.close;
		})
	})
})

module.exports = router;