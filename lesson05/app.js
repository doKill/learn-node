var express = require('express'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    eventproxy = require('eventproxy'),
    async = require('async'),
    url = require('url'),
    app = express(),
    topicUrls = [],
    cnodeUrl = 'https://cnodejs.org/';


superagent.get(cnodeUrl)
    .end(function(err, res) {
        if (err) {
            return console.error(err);
        }
        var $ = cheerio.load(res.text);
        // 获取首页所有的链接
        $('#topic_list .topic_title').each(function(idx, element) {
            var $element = $(element);
            var href = url.resolve(cnodeUrl, $element.attr('href'));
            topicUrls.push(href);
        });


        function fetchUrl(topicUrl) {
            superagent.get(topicUrl).end(function(err, res) {
                receive([topicUrl, res.text]);
            });
        };


        function receive(params) {
            var res = params.map(function(param){
                console.log(param.url)
            })
            /*prams = prams.forEach(function(topicPair) {
                var topicUrl = topicPair[0],
                    topicHtml = topicPair[1],
                    $ = cheerio.load(topicHtml);
                return ({
                    title: $('.topic_full_title').text().trim(),
                    href: topicUrl,
                    comment1: $('.reply_content').eq(0).text().trim(),
                    author: $('.changes a').text().trim(),
                    score: $('.floor .big').text().trim().replace('积分: ', '')
                });
            });
            send(prams)
            console.log(prams)*/
        };

        async.mapLimit(topicUrls, 25, function (url, callback) {
          fetchUrl(url, callback);
        }, function (err, result) {
          console.log('final:');
          console.log(result);
        });

    });

    function send(datas) {
        app.get('/', function(req, res) {
            res.send(datas)
        })
    }

app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});