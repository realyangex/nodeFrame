/**
 *	mysql模块 负责连接数据库
 */

 var config = require('../config/dbConfig');
 var mysql = require('mysql');
 var db_conf = config.mysql;
 var pool = mysql.createPool(db_conf);
 pool.getConnection(function(err,connection){
 	return connection;
 });
 // var conn = null;
 // var link = function() {
 // 	if(conn==null){
 // 		conn=client.create({
 // 			'maxconnection':20
 // 		});
 // 	}else{

 // 	}
 // 	conn.on("error",function(err){
 // 		console.log("mysql error",err);
 // 	});
 // 	return conn;
 // };

 module.exports = pool;