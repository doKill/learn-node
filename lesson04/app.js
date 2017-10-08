var express = require('express'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    eventproxy = require('eventproxy'),
    url = require('url'),
    app = express(),
    topicUrls = [],
    cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
    .end(function (err, res) {
        if (err) {
            return console.error(err);
        }
        var $ = cheerio.load(res.text);
        // 获取首页所有的链接
        $('#topic_list .topic_title').each(function (idx, element) {
            var $element = $(element);
            // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
            // 我们用 url.resolve 来自动推断出完整 url，变成
            // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
            // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
            var href = url.resolve(cnodeUrl, $element.attr('href'));
            topicUrls.push(href);
        });


        topicUrls.forEach(function (topicUrl) {
            superagent.get(topicUrl)
                .end(function (err, res) {
                    ep.emit('topic_html', [topicUrl, res.text]);
                });
        });


        var ep = new eventproxy();

        ep.after('topic_html', topicUrls.length, function (topics) {
            topics = topics.map(function (topicPair) {
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

            send(topics)
        });

    });

function send(datas) {
    app.get('/', function (req, res) {
        res.send(datas)
    })
}

app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});

