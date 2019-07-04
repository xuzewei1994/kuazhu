(function($){
	var $dropdown = $('.dropdown');
	//hover(鼠标移入时执行函数,鼠标移出时执行函数)
	$dropdown.hover(function(){
		//这里的this指向data-active="menu"然后做字符串的拼接
		var activeClass = $(this).data('active') + "-active";
		//添加到css这里的activeClass => menu-active
		$(this).addClass(activeClass);
	},function(){
		var activeClass = $(this).data('active') + "-active";
		$(this).removeClass(activeClass);
	})
})(jQuery);