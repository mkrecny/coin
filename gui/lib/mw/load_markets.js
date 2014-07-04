var async = require('async');

module.exports = function(req,res,next){

	DAO.getMeta('markets', function(err, markets){

		res.locals.markets = [];

		async.each(markets, function(market, cb){
			DAO.getMarketArbs(market, function(err, arbs){
				if (!arbs) arbs = [];
				var depth = res.locals.depth[market];
				if (!depth) return cb(err);
				res.locals.markets.push({market:market, arbs:arbs, depth:depth});			
				cb(err);
			});
		}, function(err){
			res.locals.markets = _.sortBy(res.locals.markets, function(market){
				return market.arbs.length*-1;
			});
			next();
		});

	});

};
