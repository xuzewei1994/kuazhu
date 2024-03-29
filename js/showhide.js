(function($){
	function init($elem,hiddenCallback){
		//$('选择器:hidden')：匹配所有不可见元素
		if($elem.is(':hidden')){
			$elem.data('status','hidden');
			//如果元素是隐藏状态,则将元素水平方向所有值归0
			//为左右卷入卷出动画做准备
			typeof hiddenCallback == 'function' && hiddenCallback();
		}else{
			$elem.data('status','shown');
		}
	}
	function show($elem,callback){
		if($elem.data('status') == 'show') return;
		if($elem.data('status') == 'shown') return;

		//显示之前监听事件
		$elem.trigger('show').data('status','show');

		typeof callback == 'function' && callback();
	}
	function hide($elem,callback){
		if($elem.data('status') == 'hide') return;
		if($elem.data('status') == 'hidden') return;
		$elem.trigger('hide').data('status','hide');
		typeof callback == 'function' && callback();
	}

	var slient = {
		init:function($elem){
			init($elem);
		},
		show:function($elem){
			show($elem,function(){
				$elem.show();

				$elem.trigger('shown').data('status','shown');
			})
		},
		hide:function($elem){
			hide($elem,function(){
				$elem.hide();
				$elem.trigger('hidden').data('status','hidden');
			})
		}
	}
	var js = {
		fade:{
			init:function($elem){
				js._init($elem);
			},
			show:function($elem){
				js._show($elem,'fadeIn');
			},
			hide:function($elem){
				js._hide($elem,'fadeOut');
			}
		},
		slide:{
			init:function($elem){
				js._init($elem);
			},
			show:function($elem){
				js._show($elem,'slideDown');
			},
			hide:function($elem){
				js._hide($elem,'slideUp');
			}
		},
		slideLeftRight:{
			init:function($elem){
				js._customInit($elem,{
					width:0,
					paddingLeft:0,
					paddingRight:0,
					borderLeftWidth:0,
					borderRightWidth:0
				})
			},
			show:function($elem){
				js._customShow($elem);
			},
			hide:function($elem){
				js._customHide($elem,{
					width:0,
					paddingLeft:0,
					paddingRight:0,
					borderLeftWidth:0,
					borderRightWidth:0
				})
			}
		},
		fadeSlideLeftRight:{
			init:function($elem){
				js._customInit($elem,{
					width:0,
					paddingLeft:0,
					paddingRight:0,
					borderLeftWidth:0,
					borderRightWidth:0,
					opacity:0
				})
			},
			show:function($elem){
				js._customShow($elem);
			},
			hide:function($elem){
				js._customHide($elem,{
					width:0,
					paddingLeft:0,
					paddingRight:0,
					borderLeftWidth:0,
					borderRightWidth:0,
					opacity:0
				})
			}
		}
	}
	js._init = function($elem){
		$elem.removeClass('transition');
		init($elem);
	}
	js._show = function($elem,mode){
		show($elem,function(){
			$elem
			.stop()
			[mode](function(){
				$elem.trigger('shown').data('status','shown');
			})
		})
	}
	js._hide = function($elem,mode){
		hide($elem,function(){
			$elem
			.stop()
			[mode](function(){
				$elem.trigger('hidden').data('status','hidden');
			})
		})
	}
	js._customInit = function($elem,options){
		$elem.removeClass('transition');
		//1.记录元素水平方向所有值
		var styles = {};
		for(var key in options){
			styles[key] = $elem.css(key);
		}
		$elem.data('styles',styles)
		//2.当隐藏状态时,水平方向所有值归0
		init($elem,function(){
			$elem.css(options)
		})
	}
	js._customShow = function($elem){
		$elem.show()//display:block
		show($elem,function(){
			$elem
			.stop()
			.animate($elem.data('styles'),function(){
				$elem.trigger('shown').data('status','shown');
			})
		})
	}
	js._customHide = function($elem,options){
		hide($elem,function(){
			$elem
			.stop()
			.animate(options,function(){
				$elem.trigger('hidden').data('status','hidden');
			})
		})
	}

	//获取显示隐藏动画的方法
	function getShowHide($elem,options){
		/*默认情况执行slient*/
		var showhideFn = slient;
		/*如果使用js中的方法*/
		if(options.js){
			showhideFn = js[options.mode]//js.fade
		}
		//初始化当前传入的DOM元素
		showhideFn.init($elem);
		//返回对应的显示隐藏方法
		return {
			show:showhideFn.show,
			hide:showhideFn.hide
		}
	}

	//默认状态显示
	var DEFAULTS = {
		js:true,
		mode:'fade'
	}

	/*封装showHide插件*/
	$.fn.extend({
		//接收showHide传入的参数(options)
		showHide:function(options){

			/*1.遍历元素,实现隐式迭代*/
			//返回jQuery对象实现链式调用
			return this.each(function(){

				/*2.获取DOM节点*/
				var $elem = $(this);

				/*3.获取动画的执行方法//实现单例模式*/
				//将获取到的信息存储到data上
				var showHideObj = $elem.data('showHideObj');
				//如果data上没有showHideObj
				if(!showHideObj){

					//如果不传参数用默认信息(DEFAULTS)
					//如果传参数用配置信息
					options = $.extend({},DEFAULTS,options);
					//用showHideObj存储获取到的方法
					showHideObj = getShowHide($elem,options);

					/*存储到当前DOM节点*/
					$elem.data('showHideObj',showHideObj);
				}
				
				//第二次进入该函数则是调用显示隐藏的动画方法
				if(typeof showHideObj[options] == 'function'){
					showHideObj[options]($elem)
				}
			})
		}
	})
})(jQuery);