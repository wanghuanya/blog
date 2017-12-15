var express = require('express');
var router = express.Router();

// 导入连接的模块
var connection = require('../common/model.js').connection;

// 用户首页
router.get('/', function(req, res, next) {
	console.log(req.session.admin);
	connection.query('select count(*) as total from users',function(err,results){
		if(err){
			console.log('获取数据失败');
		}else{
			var page = {};
			// 总数据条数
			page.total = results[0].total;
			// 每页的数据条数
			page.every = 3;
			// 总页码
			page.pages = Math.ceil(page.total/page.every);
			// 当前的页码
			page.now = req.query.p ? Number(req.query.p) : 1;
			// 上一页
			page.prev = page.now-1 < 1 ? 1 : page.now-1;
			// 下一页
			page.next = page.now+1 > page.pages ? page.pages : page.now+1;

			// 4.查询数据
			connection.query('select * from users limit '+(page.now-1)*page.every+','+page.every,function(err,results,fields){
				if(err){
					console.log('查询失败',err);
				}else{
					res.render('users/index',{results:results,moment:require('moment'),page:page,admin:req.session.admin});
				}
			})
		}
	})

});

// 用户的添加页面
router.get('/insert',function(req,res){
	res.render('users/insert');
})

// 执行用户添加
router.post('/insert',function(req,res){
	// console.log(req.body);
	req.body.password = require('../common/common.js').md5(req.body.password);

	req.body.addtime = Math.floor(new Date().getTime()/1000);
	// 4.将获取的数据添加到数据库中
	connection.query('insert into users(username,age,sex,password,phone,addtime) values("'+req.body.username+'",'+req.body.age+','+req.body.sex+',"'+req.body.password+'","'+req.body.phone+'","'+req.body.addtime+'")',function(err,results,fields){
		if(err){
			console.log('添加数据失败',err);
		}else{
			// 添加成功时，跳转到用户首页
			res.redirect('/users');
		}
	});
})

// 修改用户界面
router.get('/update/:id',function(req,res){
	connection.query('select * from users where id ='+req.params.id,function(err,results){
		if(err){
			console.log('查询失败');
		}else{
			res.render('users/update',{results:results[0]});
		}
	});
})

router.post('/update',function(req,res){
	console.log(req.body);
	connection.query('update users set username="'+req.body.username+'",age='+req.body.age+',sex='+req.body.sex+' where id='+req.body.id,function(err,results){
		if(err){
			res.redirect('back');
		}else{
			res.redirect('/users');
		}
	})
})

// 删除
router.get('/delete/:id',function(req,res){
	console.log('delete from users where id='+req.params.id);
	connection.query('delete from users where id ='+req.params.id,function(err,results){
		if(err){
			res.redirect('back');
		}else{
			res.redirect('/users');
		}
	});
})

// 上传头像
router.get('/image/:id',function(req,res){
	console.log(req.session.admin);
	res.render('users/image',{id:req.params.id});
})

var multer = require('multer');
var upload = multer({
	dest:'public/upload'
})

router.post('/image',upload.single('photo'),function(req,res){
	console.log(req.body.id);
	// 判断文件大小是否符合要求
	if(req.file.size > 102400){
		res.send('图片过大');
	}

	// 判断文件类型是否符合要求
	var arr = ['image/png','image/gif','image/jpeg'];
	if(arr.indexOf(req.file.mimetype)=== -1){
		res.send('上传的文件不符合类型');
	}

	// 给文件设置后缀名
	var fs = require('fs');
	var path = require('path');
	// 拼接老名字和新名字
	var oldname = path.join('public/upload',req.file.filename);
	// 补充文件的后缀名
	var filename = req.file.filename+path.extname(req.file.originalname);
	 var newname = path.join('public/upload',filename);
	
	console.log(filename);
	fs.rename(oldname,newname,function(err){
		if(err){
			console.log('修改失败',err);
		}else{
			connection.query('update users set photo="'+filename+'" where id='+req.body.id,function(err){
				if(err){
					console.log('修改用户头像失败',err);
				}else{
					res.redirect('/users');
				}
			})
		}
	})
})

module.exports = router;
