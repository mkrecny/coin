module.exports = function(view){
  return function(req,res,next){
			res.render(view);
    /*res.render(view, function(err, html){
			if (err) return next(err);
      res.end(html);
      lib('redis').set('cached:'+req.originalUrl, html, function(){});
    });*/
  }
};
