var redis = require('redis').createClient();
var _ = require('underscore');

var DAO = {

	recordMeta : function(type, data, cb){
		redis.set('meta:'+type, JSON.stringify(data), cb);
	},

	getMeta : function(type, cb){
		redis.get('meta:'+type, function(err, data){
			return cb(err, JSON.parse(data));
		});
	},

	setMarketArbs : function(market, arbs, cb){
		redis.set('market:'+market+':arbs', JSON.stringify(arbs), cb);
	},

	getMarketArbs : function(market, cb){
		redis.get('market:'+market+':arbs', function(err, arbs){
			return cb(err, JSON.parse(arbs));
		});
	},
	
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
