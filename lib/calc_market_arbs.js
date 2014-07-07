var _ = require('underscore')
, colors = require('colors')
, math = require('mathjs')
, fee = 0.005;


function float(str){
	return parseFloat(str, 10);
}

module.exports = function(opts, cb){

		var market = opts.market
		, max_spend = opts.max_spend || Infinity
		, trades = []; // profitable trades stored here

		var comps = 0;

		Object.keys(market).forEach(function(buy_x, i){
			Object.keys(market).forEach(function(sell_x, _i){

				if (buy_x == sell_x) return;

				var asks = market[buy_x].asks; //people we might buy from
				var bids = market[sell_x].bids; //people we might sell to
				
				comps+=1;

				asks.forEach(function(ask, i){
					bids.forEach(function(bid, _i){
						
						var trade = {
							market : opts.market_symbol,
							buy_exchange : buy_x,
							buy_quantity : float(ask[0]),
							buy_price : float(ask[1]),
							sell_exchange : sell_x,
							sell_quantity : float(bid[0]),
							sell_price : float(bid[1])
						}; //TODO: have the DAO cast prices to numbers


						trade.cost = (trade.buy_quantity*trade.buy_price)+(trade.buy_quantity*trade.buy_price*fee);
						trade.revenue = (trade.buy_quantity*trade.sell_price)-(trade.buy_quantity*trade.sell_price*fee);
						trade.profit = trade.revenue - trade.cost;
						trade.margin = trade.profit/trade.cost*100;

						
						if (trade.buy_quantity > trade.sell_quantity) return; //we want to be able to get rid of all of it


						['buy_quantity', 'buy_price', 'sell_quantity', 'sell_price', 'cost','revenue','profit','margin'].forEach(function(attr){
							trade[attr] = math.round(trade[attr], 4);
						});


						trade.profit > 0 && trades.push(trade)

					});
				});

			});
		});

		trades = _.sortBy(trades, 'profit').reverse();
		console.log(comps, 'xchange comparisons made');
		return cb(null, trades);	
};
