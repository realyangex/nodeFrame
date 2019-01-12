var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/list",function(req,res){
	res.send("user list");
});

//正则表达
router.get("/ad*cd",function(req,res){
	res.send("regexp");
})
module.exports = router;
