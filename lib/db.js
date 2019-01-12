
var mysql = require('./mysql');
var config = require('../config/config');
var db ={};

db.insert = function(table,arr,cb)
{
	if(table=='') return null;
	if(arr){
		var fields = "";
		var values = "";
		for(var x in arr){
				var key = x;
				var va = arr[x];
				fields+= key+",";
				values+= "'"+va+"',";
		}
		fields = fields.substr(0,fields.length-1);
		values = values.substr(0,values.length-1);
		if(config.showSql) console.log("insert into `"+table+"`("+fields+")values("+values+")");
		mysql.query({
			sql:"insert into `"+table+"`("+fields+")values("+values+")",
		},function(err,rows){
			var data = JSON.parse(JSON.stringify(rows));
			cb(data);
		})
	} 
}

db.update = function(table,arr,where,cb)
{
	if(table=='') return null;
	if(arr){
		var setstr = "set ";
		console.log(arr.length);
		for(var x in arr){
				var key = x;
				var va = arr[x];
				setstr +=key+"='"+va+"',";
		}
		setstr = setstr.substr(0,setstr.length-1);
		if(config.showSql) console.log("update `"+table+"`"+setstr+" "+where);
		mysql.query({

			sql:"update `"+table+"`"+setstr+" "+where,
		},function(err,rows){
			if(err){
				 console.err;
			}else{
				cb(rows);
			}
		})
	}
}

db.delete = function(table,where,cb)
{
	if(table=='') return null;
	if(config.showSql) console.log("delete from `"+table+"`"+where);
	mysql.query({
		sql:"delete from `"+table+"`"+where,
	},function(err,rows){
		cb(rows);
	})
	
}

db.getAll =  function(table,where,orderBy,cb)
{	
	var data = null;
	if(table=='') return null;
	var whereStr = "";
	var orderByStr = "";
	if(where!=""&&where!=null) whereStr=where;
	if(orderBy!=""&&orderBy!=null) orderByStr= orderByStr ;
	if(config.showSql) console.log("select * from `" +table+"`"+whereStr+" "+orderByStr);
	mysql.query({
		sql:"select * from `" +table+"`",
	}, function(err,rows){
		// cb(null,rows);
		
		if(err)
		{
			data =  err;
			return;
		}
		cb(rows);
		
	})

};

db.getByPage =  function(table,pageSize,page,where,orderBy,cb)
{	
	if(table=='') return null;
	var start = (page-1)*pageSize;
	var whereStr = "";
	var orderByStr = "";
	if(where!=""&&where!=null) whereStr=where;
	if(orderBy!=""&&orderBy!=null) orderByStr= orderBy ;
	if(config.showSql) console.log("select * from `" +table+"` "+whereStr+" "+orderByStr+" limit "+start+","+pageSize);
	mysql.query({
		sql:"select * from `" +table+"` "+whereStr+" "+orderByStr+" limit "+start+","+pageSize,
	}, function(err,rows){
		// cb(null,rows);
		
		if(err)
		{
			data =  err;
			console.log(err);
			cb(false);
		}
		cb(rows);
		
	})

};

db.getOne = function(table,where,cb)
{	   
	if(table=='') return null;
	if(config.showSql) console.log("select * from `" +table+"`"+where);
	mysql.query({
		sql:"select * from `" +table+"`"+where,
	},function(err,rows){
		// var data = JSON.parse(JSON.stringify(rows));
		cb(rows[0]);
	})
	 
};

db.query = function(sql,cb)
{
	if(sql=='') return null;
	if(config.showSql) console.log(sql);
	mysql.query({
		sql:sql,
	},function(err,rows){
		if(err){
			console.log(err)
		}
		else{
			cb(rows);
		}
		
	})
}

module.exports = db;