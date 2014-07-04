var redis = require('redis').createClient();
var _ = require('underscore');

var DAO = {
	
	//TODO:
	//setExchangeDepth

	setMarketDepth : function(market, exchange, asks, bids, cb){
		depth = {};
		depth[exchange] = JSON.stringify({asks:asks, bids:bids});
		redis.hmset('depth:market:'+market, depth, cb);
	},

	getMarketDepth : function(cb){
		redis.keys('depth:market:*', function(err, keys){
			var multi = redis.multi();
			keys.forEach(function(key){
				multi.hgetall(key);			
			});
			multi.exec(function(err, depth){
				depth = _.map(depth, function(d){
					for (exchange in d){
						d[exchange] = JSON.parse(d[exchange]);
					}
					return d;
				});
				keys = _.map(keys, function(k){
					return k.split(':')[2];
				});
				return cb(err, _.object(keys, depth));
			});
		});
	}

};

module.exports = DAO;
