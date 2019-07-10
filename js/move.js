(function($){
/*共同函数开始*/
	function init($elem){
		this.$elem = $elem;
		this.$elem.removeClass('transition');
		//去除px转换为纯数字方便计算
		this.currentX = parseFloat(this.$elem.css('left'));
		this.currentY = parseFloat(this.$elem.css('top'));
	}
	function to(x,y,callback){
		//1.如果x有参数则=x 否则让x=目标值
		x = (typeof x == 'number') ? x : this.currentX;
		y = (typeof y == 'number') ? y : this.currentY;
		//2.防止再次点击
		if(this.currentX == x && this.currentY == y) return;
		//3.移动之前监听事件
		this.$elem.trigger('move');
		//4.添加动画过渡效果
		typeof callback == 'function' && callback();
		//5.更新当前元素的位置坐标
		this.currentX = x;
		this.currentY = y;
	}
/*共同函数结束*/

/*1.移动不加入动画开始*/
	//$elem = $('.box')
	function Silent($elem){
		init.call(this,$elem);
	}
	Silent.prototype = {
		constructor:Silent,
		//移动方法
		to:function(x,y){
			to.call(this,x,y,function(){
				this.$elem.css({
					left:x,
					top:y
				},function(){
					//移动之后监听事件
					this.$elem.trigger('moved');
				}.bind(this));
			}.bind(this));
		},
		//直接沿着X轴移动
		x:function(x){
			this.to(x);
		},
		//直接沿着Y轴移动
		y:function(y){
			this.to(null,y)
		}
	}
/*移动不加入动画结束*/


/*2.移动加入动画开始*/
	function Js($elem){
		init.call(this,$elem);
	}
	Js.prototype = {
		constructor:Js,
		//移动方法
		to:function(x,y){
			to.call(this,x,y,function(){
				this.$elem.stop().animate({
					left:x,
					top:y
				},function(){
					//移动之后监听事件
					this.$elem.trigger('moved');
				}.bind(this));
			}.bind(this));
		},
		//直接沿着X轴移动
		x:function(x){
			this.to(x);
		},
		//直接沿着Y轴移动
		y:function(y){
			this.to(null,y)
		}
	}
/*移动加入动画结束*/


//获取移动的方法
	function getmove($elem,options){
		var move = null;
		/*如果使用js中的方法*/
		if(options.js){
			move = new Js($elem);
		}else{
			move = new silent($elem);
		}
		return {
			to:move.to.bind(move),
			x:move.x.bind(move),
			y:move.y.bind(move)
		}
	}

//默认状态显示
	 var DEFAULTS = {
		js:true
	}

/*move插件*/
$.fn.extend({
	//接收move传入的参数(options,x,y)
	move:function(options,x,y){

		/*1.遍历元素,实现隐式迭代*/
		//返回jQuery对象实现链式调用
		return this.each(function(){

			/*2.获取DOM节点*/
			var $elem = $(this);

			/*3.获取动画的执行方法*//*实现单例模式*/
			//将获取到的信息存储到data上
			var moveObj = $elem.data('moveObj');

			//如果data上没有moveObj
			if(!moveObj){
				//如果不传参数用默认信息(DEFAULTS)
				//如果传参数用配置信息
				options = $.extend({},DEFAULTS,options);

				//用moveObj存储获取到的方法
				moveObj = getmove($elem,options);

				/*存储到当前DOM节点*/
				$elem.data('moveObj',moveObj);
			}
			
			//第二次进入该函数则是调用移动的方法
			if(typeof moveObj[options] == 'function'){
				//接收参数(options,x,y)
				moveObj[options](x,y)
			}
		})
	}
})
})(jQuery)