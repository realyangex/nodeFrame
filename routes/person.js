var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var myDate = require('../lib/dateUtil');
var db = require('../lib/db');
/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('message',{'title':'登录提示'});
  // console.log(req.session)
  // console.log(req.session.userName)
  if(req.session.userName){
  	var username = req.session.userName;
  	//username = "admin";
  	db.getOne('user',"where username='"+username+"'",function(data){
  		name = data.name;
        var userType = data.user_type
  		//统计发布信息数
  		$sql = "SELECT type,COUNT(*) as 'count' FROM need WHERE username = '"+username+"' GROUP BY TYPE";
  		db.query($sql,function(data){
  				var type1Count = 0;
  				var type2Count = 0;
  			for(var x in data)
  			{
  				item = data[x];
  				if(item.type=="1"){
  					type1Count = item.count;
  				}
  				if(item.type=="2"){
  					type2Count = item.count;
  				}
  			}
  			
  			res.render("person",{'name':name,'type1Count':type1Count,'type2Count':type2Count,'userType':userType});
  		})
  		
  	})
  }else{
  	 res.render('message',{'title':'登录提示'});
  }
});

router.get('/login', function(req, res, next) {
  res.render('login');
  // res.render('message');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/checkName', function(req, res, next) {
  var name = req.query.username;
  console.log(name);
  db.getOne('user',"where username='"+name+"'",function(data){
console.log(data);
  	if(data==""||typeof(data)=="undefined"){

  	res.send("0"); 

  	}else{
  		res.send("1");
  	}
  })
  
});

router.post('/register', function(req, res, next) {
  
  var username = req.body.username;
  var password = req.body.password;
  var hash = crypto.createHash('md5');
  password = hash.update(password).digest('hex');
  var now = myDate.getFullDate();
  var temp = "'"+Math.random()+"'";
  var name = "用户"+temp.substr(3,5);
  var arr = [];
  arr["username"] =username;
  arr["password"] =password;
  arr["registertime"] =now;
  arr["name"] =name;
  db.insert('user',arr,function(data){
  	 console.log(data.insertId+"");
  	 res.send("1");
  })
});

router.post("/login",function(req,res,next){
	var  username = req.body.username;
	var  password = req.body.password;
	var hash = crypto.createHash('md5');
	password = hash.update(password).digest('hex');
	db.getOne('user',"where username='"+username+"' and password='"+password+"'",function(data){
		console.log(data);
		if(typeof(data)!="undefined"){
			req.session.userName = username;
			req.session.userType = data.user_type;
			req.session.userid = data.id;
			res.send("1");console.log(1);
		}else{
			res.send("0");console.log(0);
		}
		
	});

})

//退出
router.all("/exit",function(req,res,next){
	req.session.userName = null;
	req.session.userType = null;
	res.render('message',{'title':'退出提示'});
})

//修改信息
router.get("/changeInfo",function(req,res,next){
	if(req.session.userName)
	{	
		var username = req.session.userName;
		db.getOne('user',"where username='"+username+"'",function(data){
			var name = data.name;
			var phone = data.phone;
			res.render('changeInfo',{'name':name,'phone':phone});
		})
	}else{
		res.render("message",{'title':'登录提示'});
	}
	
})

//修改信息
router.post("/changeInfo",function(req,res,next){
	var username = req.body.username;
	var phone = req.body.phone;

	console.log(req.session.userName)
	if(req.session.userName){
		var userName = req.session.userName;

		var arr = [];
		arr["name"] = username;
		arr["phone"] = phone;
		console.log(arr);
		db.update('user',arr,"where username='"+userName+"'",function(data){
			if(data){
				res.send("1");
			}
		})
	}else{
		res.send("403"); 
	}
})


module.exports = router;