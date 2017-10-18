var async = require('async');
var fs = require('fs');

async.auto({one,two},
    function(err, results) {
        console.log(err)
    });

function one(){
	fs.readFile('./test.txt', 'utf8', function(err,data){
		if(!err && data){
			console.log(data)
		}
	});
}

function two(){
	fs.readFile('./test2.txt', 'utf8', function(err,data){
		if(!err && data){
			console.log(data)
		}
	});
}


/*
 *  series
 *  waterfall
 *  parallel
 *  parallelLimit
*/