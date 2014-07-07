#!/usr/bin/env node
var start_ms = new Date().getTime()
var DAO = require('./lib/dao.js')
, async = require('async')
, calcArbs = require('./lib/calc_market_arbs.js')
, argv = require('optimist')
.usage('--m [market] --s [max_spend]')
.demand([])
.argv;

DAO.getMarketDepth(function(err, depth){

	var markets = argv.m ? [argv.m] : Object.keys(depth);
	var opts = [];

	markets.forEach(function(m){
		opts.push({
			market:depth[m],
			market_symbol:m,
			max_spend:argv.s || Infinity
		});
	});

	var iterator = function(options, cb){
		console.log('calculating', options.market_symbol, 'arbs');
		calcArbs(options, function(err, arbs){
			console.log('found', arbs.length, options.market_symbol, 'arb opportunities');
			DAO.setMarketArbs(options.market_symbol, arbs, function(){
				console.log('recorded', options.market_symbol, 'arbs', new Date());
				cb(null);
			});
		});
	};

	async.eachSeries(opts, iterator, function(){
		var end_ms = new Date().getTime();
		console.log('completed', opts.length, 'arb assessments');
		console.log((end_ms-start_ms)/1000, 'seconds');
		process.exit();
	});

});
