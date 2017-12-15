/**
 * Module dependencies.
 */

TopClient = require('./topClient').TopClient;

var client = new TopClient({
          'appkey':'23341634',
          'appsecret':'7e30a1c2c254c9a109f283067e8d5e18',
          'REST_URL':'http://api.daily.taobao.net/router/rest'});

client.execute('taobao.user.get',
              {
                  'fields':'nick,type,sex,location',
                  'nick':'sandbox_c_1'
              },
              function (error,response) {
                  if(!error)
                    console.log(response);
                  else
                    console.log(error);
              })