var express = require('express');
var router = express.Router();
var connection = require('../common/model.js').connection;

// 首页
router.get('/', function(req, res) {
	console.log(req.query);
	var where = '';
	var param = '';
	if(req.query.tid){
		where = ' where tid='+req.query.tid;
		// 获取的搜索条件
		param = '&tid='+req.query.tid;
	}
	req.body.addtime = Math.floor(new Date().getTime()/1000);

	connection.query('select count(*) as total from articles'+where,function(error,results3){
        if (error) {
            console.log('获取数据失败');
        } else { 
            var page = {};
            // 总数据条数
            page.total = results3[0].total;
            // 每页的数据条数
            page.every = 3;
            // 总页码
            page.pages = Math.ceil(page.total/page.every);
            // Number():将纯数字字符串转换数字
            page.now = req.query.p ? Number(req.query.p) : 1;
            // 上一页
            page.prev = page.now-1 < 1 ? 1 : page.now-1;
            // 下一页
            page.next = page.now+1 > page.pages ? page.pages : page.now+1;
			// 分页条件
			var limit = ' limit '+(page.now-1)*page.every+','+page.every;
			// 查询文章
			connection.query('select * from articles '+where+' order by articles.id desc '+ limit,function(error,results1){
				if(error){
					console.log('查询失败',error);
				}else{
					// 查询分类
					connection.query('select * from types',function(error,results2){
						if(error){
							console.log('查询失败',error);
						}else{
           					res.render('index',{ results1: results1,results2:results2,moment:require('moment'),page:page,admin:req.session.admin,param:param});
						}
					})
				}
			})
        }
    })
});

// 详情页
router.get('/show/:id', function(req, res) {

	req.body.addtime = Math.floor(new Date().getTime()/1000);

	connection.query('select * from articles where id = '+req.params.id,function(error,results){
		if(error){
			console.log('查询失败',error);
		}else{
  			res.render('show',{results:results[0],moment:require('moment')});
		}
	})
});

// 注册页面
router.get('/reg',function(req,res){
	res.render('reg');
})

// 提交数据并添加到数据库
router.post('/reg',function(req,res){
	// 加密密码
	req.body.password = require('../common/common.js').md5(req.body.password);
	// 添加时间
	req.body.addtime = Math.floor(new Date().getTime()/1000);
	// 接收数据
	connection.query('insert into users(username,password,phone,addtime) values("'+req.body.username+'","'+req.body.password+'","'+req.body.phone+'",'+req.body.addtime+')',function(error){
		if (error) {
			console.log('添加失败',error);
		} else {
			// res.send('注册成功');
			// 注册成功，跳转到登录页面
			res.redirect('/login');
		}
	})
})

// 登录页面
router.get('/login',function(req,res){
	res.render('login',{error:req.flash('error').toString()});
})

// 执行登录操作
router.post('/login',function(req,res){
	req.body.password = require('../common/common.js').md5(req.body.password);
	// 接收用户名和密码，判断用户名和密码是否正确（链接数据库）
	connection.query('select * from users where username = "'+req.body.username+'" and password="'+req.body.password+'"',function(error,results){
		if (error) {
			console.log('查询失败',error);
		} else {
			// console.log(results);
			// 程序进入到else路线，不一定用户名和密码就是正确的
			// 查询到数据 [{username:"zhangsan"...}]
			// 查询不到数据 []
			if (results.length === 0) {
				// 将错误信息保存到flash中
				req.flash('error','用户名和密码匹配错误');
				// 没有数据，意味着用户名和密码不匹配
				res.redirect('back');
				// console.log(err);
			} else {
				// 表示用户登录成功
				req.session.admin = results[0];

				// 有数据，用户名和密码匹配
				res.redirect('/users');
			}
		}
	})
})

// 检验用户名是否存在
router.post('/check',function(req,res){
	// console.log(req.body);
	// res.send('ok');
	connection.query('select * from users where username = "'+req.body.username+'"',function(error,results){
		if(error){
			console.log('查询失败',error);
		}else{
			// console.log('查询数据成功',results);
			if(results.length === 1){
				res.json({"success":1,"more":['aa12','aa23','12aa']});
			}else{
				res.json({"success":0});
			}
		}
	})
})

// 发送验证码
router.post('/msg',function(req,res){
	console.log(req.body);
	// 随机生成四位数
	function rand(m,n){
		return Math.floor(Math.random()*(n-m+1)+m);
	}
	// 获取随机数
	var code = rand(1000,9999);
	// 将验证码保存到session中
	req.session.code = code;
	// 通过阿里大于发送短信
	TopClient = require('../common/alidayu/topClient.js').TopClient;


	var client = new TopClient({
	    'appkey': '23341634',
	    'appsecret': '7e30a1c2c254c9a109f283067e8d5e18',
	    'REST_URL': 'http://gw.api.taobao.com/router/rest'
	});
	 
	client.execute('alibaba.aliqin.fc.sms.num.send', {
	    'extend':'123456',
	    'sms_type':'normal',
		// 签名：本网站的标识符，不能改变
	    'sms_free_sign_name':'俊哥技术小站',
		// 短信模板中的code参数
	    'sms_param':'{\"code\":\"'+code+'\"}',
	    'rec_num':req.body.phone,
		// 短信模板的编号
	    'sms_template_code':'SMS_105890028'
	}, function(error, response) {
	    if (error) {
			// console.log('发送失败',error);
			res.json({"success":0});
		} else {
			// console.log('发送成功');
			res.json({"success":1});
		}
	})
})
// 点击退出 清除admin的值就可以
router.get('/logout',function(req,res){
	req.session.admin = null;
	res.redirect('/login');
})

// 引入multer文件上传模块
var multer = require('multer');
var upload = multer({
    dest:'public/upload/articles'
})

// 专门处理文章文件上传
router.post('/upload',upload.single('editormd-image-file'),function(req,res){
    // 给文件设置后缀名
    var fs = require('fs');
    var path = require('path');

    // 拼接老名字和新名字，使用rename进行改名
    var oldname = path.join('public/upload/articles',req.file.filename);
    // 补充文件的后缀名
    var filename = req.file.filename+path.extname(req.file.originalname);
    var newname = path.join('public/upload/articles',filename);

    fs.rename(oldname,newname,function(error){
        if (error) {
            res.json({success:0,message:'上传失败',url:''});
        } else {
        	var newpath = path.join('/upload/articles',filename);
            res.json({success:1,message:'上传成功',url:newpath})
        }
    })
})
module.exports = router;
