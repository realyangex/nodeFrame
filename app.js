var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var personRouter = require('./routes/person');
var needRouter = require('./routes/need');
var usersRouter = require('./routes/users');
var testRouter = require('./controller/test');
var adminRouter = require('./routes/admin');
var ejs = require('ejs');
var app = express();

//设置session 登录
app.use(session({
	secret:'secret', // 对session id 相关的cookie 进行签名
	resave:true,
	saveUninitialized:false,
	cookie : {
        maxAge : 1000 * 60 * 300, // 设置 session 的有效时间，单位毫秒
    },
}));



// view engine setup
app.set('views', path.join(__dirname,"views"));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public/",express.static('public'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/uploads/",express.static('uploads'));



app.use('/', indexRouter);
app.use('/person', personRouter);
app.use('/need', needRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('error',{'error':err});
});



var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3001); // 设定监听端口

//启动监听
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

//module.exports = router;
//热修改 需要注释掉
module.exports = app;
