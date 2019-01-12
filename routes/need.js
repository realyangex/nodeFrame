var express = require("express");
var multer = require("multer");
var myDate = require("../lib/dateUtil");
var db = require('../lib/db');
var router = express.Router();

//发布需求页面
router.get("/add",function(req,res,next){
	if(req.session.userName){
		res.render('need');
	}else{
		res.render('message',{'title':'登录提示'});
	}
});

router.get("/",function(req,res,next){
	var page = req.query.page;
	var type = req.query.type;
	if(type==1){
		type=1;
	}else{
		type =2;
	}
	/*
	db.getByPage('need',10,page,"where type='"+type+"'","order by id desc",function(result){
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

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名?
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, 'uploads/');    
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);  
    }
}); 

// 创建 multer 对象
var upload = multer({ storage: storage });

router.post("/",upload.single('img'),function(req,res,next){
	
	var content = req.body.content;
	var type = req.body.type;
	if(type=="商品"){
		type = 1;
	}else{
		type=2;
	}
	var userId = req.session.userid;
	var file = "";
	if (typeof(req.file)!="undefined"){
	    file = req.file.filename;
		console.log(file);
	}
	
	var date = myDate.getFullDate();

	//构造数组
	var arr = [];
	arr['content'] =content;
	arr['type'] =type;
	arr['userid'] =userId;
	arr['file'] =file;
	arr['date'] =date;
	console.log(arr);
	db.insert('need',arr,function(result){
		if(result){
			//res.send(result.insertId+"");
			res.render('message',{'title':'发布成功'});
		}
	})
	
})

//需求详情
router.all("/needDetail/:id",function(req,res){
	var id = req.params.id;
	db.getOne('need',"where id="+id,function(data){
		console.log(data);
		db.query("update need set comment_num=comment_num+1 where id="+id,function(){});
		res.render('needDetail',{'data':data});
	})
})

module.exports = router;