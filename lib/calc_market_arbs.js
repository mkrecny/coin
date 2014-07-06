var _ = require('underscore')
, colors = require('colors')
, fee = 0.005;


function int(str){
	return parseFloat(str, 10);
}

module.exports = function(opts, cb){

		var market = opts.market
		, max_spend = opts.max_spend || Infinity
		, trades = []; // profitable trades stored here
		Object.keys(market).forEach(function(buy_x, i){
			Object.keys(market).forEach(function(sell_x, _i){

				if (_i <= i) return;
				if (buy_x == sell_x) return;

				var asks = market[buy_x].asks; //people we might buy from
				var bids = market[sell_x].bids; //people we might sell to
				
				console.log(buy_x, sell_x, asks.length, bids.length);

				asks.forEach(function(ask, i){
					bids.forEach(function(bid, _i){
						
						var trade = {
							market : opts.market_symbol,
							buy_exchange : buy_x,
							buy_quantity : int(ask[0]/1),
							buy_price : int(ask[1]/1),
							sell_exchange : sell_x,
							sell_quantity : int(bid[0]/1),
							sell_price : int(bid[1]/1)
						}; //TODO: have the DAO cast prices to numbers


						trade.cost = (trade.buy_quantity*trade.buy_price)+(trade.buy_quantity*trade.buy_price*fee);
						trade.revenue = (trade.buy_quantity*trade.sell_price)-(trade.buy_quantity*trade.sell_price*fee);
						trade.profit = trade.revenue - trade.cost;
						
						//console.log(trade.profit > 0 ? trade.profit.toString().green : trade.profit.toString().red);

						if (trade.buy_quantity > trade.sell_quantity) return; //we want to be able to get rid of all of it
						trade.profit > 0 && trades.push(trade)

					});
				});

			});
		});

		trades = _.sortBy(trades, 'profit').reverse();

		return cb(null, trades);	
};
