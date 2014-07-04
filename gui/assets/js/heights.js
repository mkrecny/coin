(function(){

  function setElHeight(el){
    var newHeight = $(window).height() - $(el).offset().top;
    $(el).height(newHeight*0.95);
  }

	function setElWidth(el){
    var newWidth = $(window).width();
    $(el).width(newWidth);
  }


	window.fitToBottom = function(el){

		$(window).resize(function(){
			setElHeight(el)
		});

    setElHeight(el);

	};

	window.fitHorizontal = function(el){

		$(window).resize(function(){
			setElWidth(el)
		});

    setElWidth(el);

	};

})();
