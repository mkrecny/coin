
module.exports = function(req,res,next){
	DAO.getMarketArbs(req.params.market, function(err, arbs){
		console.log(arbs);
		res.locals.arbs= {market:req.params.market, arbs:arbs};
		next();
	});
};
