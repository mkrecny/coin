var Marketstem = require('./lib/marketstem.js')
, DAO = require('./lib/dao.js')
var marketstem = new Marketstem();

/*marketstem.exchanges(function(err, data){
	console.log(data);
});*/

marketstem.assets(function(err, data){
	console.log(data);
});
