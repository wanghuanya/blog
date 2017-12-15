var express = require('express');
var router = express.Router();

// 导入连接的模块
var connection = require('../common/model.js').connection;

// 用户首页
router.get('/', function(req, res, next) {
	console.log(req.session.admin);
	connection.query('select count(*) as total from types',function(err,results){
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
			connection.query('select * from types limit '+(page.now-1)*page.every+','+page.every,function(err,results,fields){
				if(err){
					console.log('查询失败',err);
				}else{
					res.render('types/index',{results:results,moment:require('moment'),page:page,admin:req.session.admin});
				}
			})
		}
	})

});

// 用户的添加页面
router.get('/insert',function(req,res){
	res.render('types/insert');
})

// 执行用户添加
router.post('/insert',function(req,res){
	console.log(req.body);

	req.body.addtime = Math.floor(new Date().getTime()/1000);
	// 4.将获取的数据添加到数据库中
	connection.query('insert into types(sort,addtime) values("'+req.body.sort+'","'+req.body.addtime+'")',function(err,results){
		if(err){
			console.log('添加数据失败',err);
		}else{
			// 添加成功时，跳转到用户首页
			res.redirect('/types');
		}
	});
})

// 修改用户界面
router.get('/update/:id',function(req,res){
	connection.query('select * from types where id ='+req.params.id,function(err,results){
		if(err){
			console.log('查询失败');
		}else{
			res.render('types/update',{results:results[0]});
		}
	});
})

router.post('/update',function(req,res){
	console.log(req.body);
	connection.query('update types set sort="'+req.body.sort+'" where id='+req.body.id,function(err,results){
		if(err){
			res.redirect('back');
		}else{
			res.redirect('/types');
		}
	})
})

// 删除
router.get('/delete/:id',function(req,res){
	console.log('delete from types where id='+req.params.id);
	connection.query('delete from types where id ='+req.params.id,function(err,results){
		if(err){
			res.redirect('back');
		}else{
			res.redirect('/types');
		}
	});
})

module.exports = router;
