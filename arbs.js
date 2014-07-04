var DAO = require('./lib/dao.js')
, calcArbs = require('./lib/calc_market_arbs.js')
, argv = require('optimist')
.usage('--m [market] --s [max_spend]')
.demand(['m'])
.argv;

DAO.getMarketDepth(function(err, depth){

	var opts = {
		market:depth[argv.m],
		market_symbol:argv.m,
		max_spend:argv.s || Infinity
	};

	calcArbs(opts, function(err, arbs){
		console.log(arbs[0]);
	});

});
