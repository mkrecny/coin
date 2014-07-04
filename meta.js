var Marketstem = require('./lib/marketstem.js')
, DAO = require('./lib/dao.js')
, argv = require('optimist')
.usage('--t [type of meta (assets, exchanges, markets) ]')
.demand(['t'])
.argv;

var marketstem = new Marketstem();

console.log('requesting', argv.t, 'meta');
marketstem[argv.t](function(err, data){

	if (err || !data){
		console.log('no data or err', err) && process.exit();
	}

	DAO.recordMeta(argv.t, data, function(){
		console.log('meta', argv.t, 'recorded', new Date());
		process.exit();
	});

});
