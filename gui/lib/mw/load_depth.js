module.exports = function(req,res,next){
	DAO.getMarketDepth(function(err, depth){
		res.locals.depth = req.params.market ? depth[req.params.market] : depth;
		res.locals.market = req.params.market;
		next();
	});
};
