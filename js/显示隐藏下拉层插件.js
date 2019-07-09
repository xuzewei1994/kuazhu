(function($){
	function Dropdown($elem,options){
		//1.罗列属性
		this.$elem = $elem;
		this.options = options;
		//获取下拉层
		this.$layer = this.$elem.find('.dropdown-layer');
		//鼠标移入移出改变背景颜色
		this.activeClass = this.$elem.data('active') + '-active';
		//设置定时器
		this.timer = 0

		//2.初始化
		this.init();

	}
	Dropdown.prototype = {
		constructor:Dropdown,
		init:function(){

			//1.初始化显示隐藏插件
			this.$layer.showHide(this.options);

			//2.监听显示隐藏事件
			this.$layer.on('show shown hide hidden',function(){
				this.$elem.trigger('dropdown-' + ev.type)
			}.bind(this));

			//3.绑定事件
			/*判断是否需要点击显示下拉层*/
			if(this.options.eventName == 'click'){
				//传入事件时click时则点击显示下拉层
				this.$elem.on('click',function(ev){
					this.show();
					//阻值事件冒泡
					ev.stopPropagation();
				}.bind(this));
				//点击其他地方隐藏下拉层
				$(document).on('click',function(){
					this.hide();
				}.bind(this));
			}else{
				this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this))
			}
			
		},

		/*处理用户快速划入事件*/
		show:function(){
			//判断是否传入延迟时间
			if(this.options.delay){
				this.timer = setTimeout(function(){
					this.$layer.showHide('show');
					//鼠标移入时添加对应class
					this.$elem.addClass(this.activeClass);
				}.bind(this),this.options.delay);
			}else{
				this.$layer.showHide('show');
				//鼠标移入时添加对应class
				this.$elem.addClass(this.activeClass);
			}
		},
		/*处理用户快速划出事件*/
		hide:function(){
			//清除定时器
			clearTimerout(this.timer);
			this.$layer.showHide('hide');
			//鼠标移出时删除对应class
			this.$elem.removeClass(this.activeClass);
		}
	}

	/*当不传参数时的默认配置信息*/
	Dropdown.DEFAULTS = {
		js:true,
		mode:'slide',
		//判断是点击显示下拉层还是划入显示下拉层
		eventName:'click'
	}


	/*封装dropdown插件*/
	$.fn.extend({
		dropdown:function(options){
			/*接收默认配置信息*/

			//1.实现隐式迭代
			this.each(function(){

				//$elem表示每一个DOM节点
				var $elem = $(this);

				//如果不传参数用默认信息，如果传参数用配置信息
				options = $.extend({},Dropdown.DEFAULTS,options);

				//只有通过Dropdown上的实例才可以调用Dropdown上的方法
				//当前节点($elem)实现下拉功能
				//实现动画效果的配置信息(options)
				new Dropdown($elem,options);
			})
		}
	})
})(jQuery)