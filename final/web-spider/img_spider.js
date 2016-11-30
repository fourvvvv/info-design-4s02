/* run
 > node ima_spider.js
 crawl image of houses to local space
*/
var fs = require('fs')
  , request = require('request')
  , cheerio = require('cheerio');

// load URL
var $ = cheerio.load('http://gameofthrones.wikia.com/wiki/Game_of_Thrones_Wiki');

// house icon spider
request('http://gameofthrones.wikia.com/wiki/Game_of_Thrones_Wiki', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $("a[title*='House']").each(function(i, element){
      var a = $(this);
      var title = a.attr('title').replace('House ', '');
      var src = a.children().find('img').attr('src');
      if (title && src) {
        // console.log(title + ': ' + src);
        // imgData = getBase64Image(src);
        // localStorage.setItem(title, imgData);
        download(src, title+'.png', function(){
          console.log('done');
        });
      }
    });
  }
});

// download file to local
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
