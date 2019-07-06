(function($){
	function Dropdown($elem,options){
		//1.罗列属性
		this.$elem = $elem;
		this.options = options;
		this.$layer = this.$elem.find('.dropdown-layer');
		this.activeClass = this.$elem.data('active') + "-active";
		//设置定时器
		this.timer = 0;
		//2.初始化
		this.init();
	}
	Dropdown.prototype = {
		constructor:Dropdown,
		init:function(){
			//1.初始化显示隐藏插件
			this.$layer.showHide(this.options);
			//2.监听显示隐藏事件
			this.$layer.on('show shown hide hidden',function(ev){
				this.$elem.trigger('dropdown-' + ev.type)
			}.bind(this))
			//3.绑定事件
			this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this));
		},
		show:function(){
			//处理用户快速划入划出触发事件
			if(this.options.delay){
				this.timer = setTimeout(function(){
					this.$layer.showHide('show');
					//显示时添加对应class
					this.$elem.addClass(this.activeClass);
				}.bind(this),this.options.delay);
			}
		},
		hide:function(){
			//清除定时器
			clearTimeout(this.timer)
			this.$layer.showHide('hide');
			//隐藏时移除对应class
			this.$elem.removeClass(this.activeClass);
		}
	}

	//当不传参数时的默认配置信息
	Dropdown.DEFAULTS = {
		js:true,
		mode:'slide',
		delay:300
	}

	//封装dropdown插件
	$.fn.extend({
		dropdown:function(options){
			//1.实现隐式迭代
			this.each(function(){
				var $elem = $(this);
				options = $.extend({},Dropdown.DEFAULTS,options);
				new Dropdown($elem,options)
			})
		}
	})
})(jQuery);