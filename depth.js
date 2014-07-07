var Marketstem = require('./lib/marketstem.js')
, DAO = require('./lib/dao.js')

var marketstem = new Marketstem();

marketstem.on('data', function(data){
	DAO.setMarketDepth(data.market, data.exchange, data.asks, data.bids, function(err, res){
		console.log(new Date(), 'depth updated @', process.uptime());
	});
});

marketstem.subscribe('depth');
