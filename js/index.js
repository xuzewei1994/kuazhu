
(function($){
	/*顶部导航逻辑开始*/
	var $dropdown = $('.dropdown');
	$dropdown.dropdown({
		js:true,
		mode:'slide'
	});
	$dropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		console.log(ev.type);
	})
	/*顶部导航逻辑结束*/
})(jQuery);