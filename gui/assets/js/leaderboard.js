$(document).ready(function(){
	//fitToBottom('.leaderlist');
	//fitToBottom('.meta');

	$('.num').each(function(){
		$(this).text(numberWithCommas($(this).text()));
	})

	/*$('.leader-cont').popover({
		placement:'left',
		container:'body',
		trigger:'hover'
	});*/

	setTimeout(function(){
		$('.email-cta').slideToggle();
	}, 4000);

	$('.email-cta .close').click(function(){
		$('.email-cta').hide()
	})

	function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

})