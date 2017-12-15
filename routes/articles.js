var express = require('express');
var router = express.Router();

// 导入连接的模块
var connection = require('../common/model.js').connection;

// 用户首页
router.get('/', function(req, res, next) {
	// connection.query('select count(*) as total from articles',function(err,results3){
	// 	if(err){
	// 		console.log('获取数据失败');
	// 	}else{
	// 		var page = {};
	// 		// 总数据条数
	// 		page.total = results3[0].total;
	// 		// 每页的数据条数
	// 		page.every = 3;
	// 		// 总页码
	// 		page.pages = Math.ceil(page.total/page.every);
	// 		// 当前的页码
	// 		page.now = req.query.p ? Number(req.query.p) : 1;
	// 		// 上一页
	// 		page.prev = page.now-1 < 1 ? 1 : page.now-1;
	// 		// 下一页
	// 		page.next = page.now+1 > page.pages ? page.pages : page.now+1;

			// 4.查询数据
			// connection.query('select * from articles limit '+(page.now-1)*page.every+','+page.every,function(err,results2,fields){
			// 	if(err){
			// 		console.log('查询失败',err);
			// 	}else{
					connection.query('select types.sort as typename,articles.* from types,articles where articles.tid = types.id order by articles.id desc', function(error,results){
						if (error) {
							console.log('查询失败',error);
						} else {
							connection.query('select * from types',function(error,results1){
								if(error){
									console.log('查询失败',error);
								}else{
								    res.render('articles/index',{results:results,results1:results1,moment:require('moment'),page:page});
								}	

							})
						}
					})
				// }
			// })
		// }
	// })

});

// 用户的添加页面
router.get('/insert',function(req,res){
	connection.query('select * from types',function(error,results){
		if(error){
			console.log('查询失败',error);
		}else{
			console.log(results);
			res.render('articles/insert',{results:results});
		}
	})
})

// 执行用户添加
router.post('/insert',function(req,res){
	// console.log(req.body);
	req.body.content = req.body.content.replace(/"/g,'\\"').replace(/\\/g,'/');
	req.body.addtime = Math.floor(new Date().getTime()/1000);
	// 4.将获取的数据添加到数据库中
	connection.query('insert into articles(tid,title,content,addtime) values('+req.body.tid+',"'+req.body.title+'","'+req.body.content+'","'+req.body.addtime+'")',function(err,results){
		if(err){
			console.log('添加数据失败',err);
		}else{
			// console.log(results);
			// 添加成功时，跳转到用户首页
			res.redirect('/articles');
		}
	});
})

// 执行用户添加
router.post('/ainsert',function(req,res){
	req.body.content = req.body.content.replace(/"/g,'\\"').replace(/\\/g,'/');
	req.body.addtime = Math.floor(new Date().getTime()/1000);
	// 4.将获取的数据添加到数据库中
	connection.query('insert into articles(tid,title,content,addtime) values('+req.body.tid+',"'+req.body.title+'","'+req.body.content+'","'+req.body.addtime+'")',function(error,results){
		if(error){
			res.json({success:0});
		}else{
			connection.query('select t.sort as typename,a.* from articles a,types t where t.id=a.tid and a.id = '+results.insertId,function(error,results1){
				if(error){
					console.log('查询失败',error);
				}else{
					var data = results1[0];
					data.addtime = require('moment').unix(data.addtime).format('YYYY-MM-DD HH:mm:ss');
					res.json({success:1,data:data});
				}
			})
		}
	});
})

// 修改用户界面
router.get('/update/:id',function(req,res){
	connection.query('select * from articles where id ='+req.params.id,function(err,results){
		if(err){
			console.log('查询失败');
		}else{
			connection.query('select * from types',function(error1,results1){
				if(error1){
					console.log('查询失败',error1);
				}else{
					res.render('articles/update',{results:results[0],results1:results1});
				}
			})
		}
	});
})

// 执行修改操作
router.post('/update',function(req,res){
	// console.log(req.body);
	req.body.content = req.body.content.replace(/"/g,'\\"').replace(/\\/g,'/');
	connection.query('update articles set title="'+req.body.title+'",content="'+req.body.content+'",tid='+req.body.tid+' where id='+req.body.id,function(err,results){
		if(err){
			console.log(err);
			res.redirect('back');
		}else{
			res.redirect('/articles');
		}
	})
})

// 删除
router.get('/delete/:id',function(req,res){
	console.log('delete from articles where id='+req.params.id);
	connection.query('delete from articles where id ='+req.params.id,function(err,results){
		if(err){
			res.redirect('back');
		}else{
			res.redirect('/articles');
		}
	});
})

// Ajax删除
router.post('/adelete',function(req,res){
	connection.query('delete from articles where id ='+req.body.id,function(error){
		if(error){
			// 删除失败
			res.json({success:0});
		}else{
			// 删除成功
			res.json({success:1});
		}
	})
})
module.exports = router;
