var _ = require('underscore')
, colors = require('colors')
, fee = 0.005;

module.exports = function(opts, cb){

		var market = opts.market
		, max_spend = opts.max_spend || Infinity
		, trades = [];

		Object.keys(market).forEach(function(buy_x, i){
			Object.keys(market).forEach(function(sell_x, _i){

				if (_i <= i) return;

				var asks = market[buy_x].asks; //people we might buy from
				var bids = market[sell_x].bids; //people we might sell to

				asks.forEach(function(ask, i){
					bids.forEach(function(bid, _i){
						
						var trade = {
							market : opts.market_symbol,
							buy_exchange : buy_x,
							buy_quantity : ask[0]/1,
							buy_price : ask[1]/1,
							sell_exchange : sell_x,
							sell_quantity : bid[0]/1,
							sell_price : bid[1]/1
						}; //TODO: have the DAO cast prices to numbers

						console.log(trade);

						trade.cost = (trade.buy_quantity*trade.buy_price)+(trade.buy_quantity*trade.buy_price*fee);
						trade.revenue = (trade.buy_quantity*trade.sell_price)-(trade.buy_quantity*trade.sell_price*fee);
						trade.profit = trade.revenue - trade.cost;
						
						if (trade.buy_quantity > trade.sell_quantity) return; //we want to be able to get rid of all of it
						if (trade.profit <= 0) return; // not profitable
						
						trades.push(trade);

					});
				});

			});
		});

		trades = _.sortBy(trades, 'profit').reverse();
		return cb(null, trades);	
};
