var express = require("express");
var multer = require("multer");
var myDate = require("../lib/dateUtil");
var db = require('../lib/db');
var router = express.Router();

router.get("/",function(req,res,next){
	if(req.session.userName=="admin"&&req.session.userType==1){
		res.render('admin');
	}else{
		//res.render('admin');
		res.render('message',{'title':'登录提示'});
	}
	
	
})

router.all("/needs",function(req,res,next){
	
	if((!req.session.userName)||req.session.userType!=1){
		res.send('没有登陆请求异常');
		return;
	}
	
	var page = req.query.page;
	var type = req.query.type;
	if(type!=""){
		type = "where type ="+type;
	}
	/*
	db.getByPage('need',10,page,type,"order by id desc",function(result){
		if(result) 
			res.send(result)
	})
	*/
	db.query("select need.id,need.type,need.content,need.date,need.file,need.comment_num,user.name from need,user where need.userid = user.id and need.type="+type+" order by need.id desc limit "+(page-1)*10+",10 ",function(result){
		console.log(result)
		if(result){
			console.log(result)
			res.send(result)
		} 
			
	})
});
router.post("/delneed",function(req,res,next){
	if((!req.session.userName)||req.session.userType!=1){
		res.send('没有登陆请求异常');
		return;
	}
	var id = req.body.id;
	db.delete('need',"where id ="+id,function(result){
		if(result) 
			res.send(result)
	})
});



module.exports = router;