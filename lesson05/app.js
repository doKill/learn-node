var express = require('express'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
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


        //给下面控制并发连接准备的方法
        function fetchUrl(topicUrl) {
            superagent.get(topicUrl).end(function(err, res) {
                var $ = cheerio.load(res.text),
                res =  {
                    title: $('.topic_full_title').text().trim(),
                    comment1: $('.reply_content').eq(0).text().trim(),
                    author: $('.changes a').text().trim(),
                    score: $('.floor .big').text().trim().replace('积分: ', '')
                };
                console.error(res)
            });
        };


        async.mapLimit(topicUrls, 15, function(url) {
            fetchUrl(url);
        });

    });

