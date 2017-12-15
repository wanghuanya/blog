// 1.引入MySQL
var mysql = require('mysql');

// 2.链接MySQL
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'app'
})

// 3.判断链接是否成功
connection.connect(function(err) {
    if (err) console.log(err);
})

// exports.username = 'zhangsan';
exports.connection = connection;