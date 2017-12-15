module.exports = {
	md5:function(password){
		var crypto = require('crypto');

		var md5 = crypto.createHash('md5');

		md5.update(password);

		return md5.digest('hex');
	}
}