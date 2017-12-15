var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var types = require('./routes/types');
var articles = require('./routes/articles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'app'
};

var sessionStore = new MySQLStore(options);
app.use(session({
    key: 'app',
    secret: 'app',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// 利用flash将一次性的提示数据只展示一次
var flash = require('connect-flash');
app.use(flash());

app.use(function(req,res,next){
    // console.log(req.url);
    var arr=['articles','types','users'];
    var url = req.url.split('/')[1];
    // 判断路径是否在权限数组中
    if(arr.indexOf(url) === -1){
        next();
    }else{
        if(req.session.admin){
            // 将数据通过res.locals直接传递给模板，模板页面就具有了admin这个变量值
            res.locals.admin = req.session.admin;

            next();  
        }else{
            res.redirect('/login');
        }
    }
});

app.use('/', index);
app.use('/users', users);
app.use('/types', types);
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
