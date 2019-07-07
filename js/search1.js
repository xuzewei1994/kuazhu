(function($){
	function Search($elem,options){
	
		/*1.罗列属性*/
		this.$elem = $elem;
		this.options = options;
		//获取form表单
		this.$searchForm = this.$elem.find('.search-form');
		//获取搜索框
		this.$searchInput = this.$elem.find('.search-input');
		//获取提交按钮
		this.$searchBtn = this.$elem.find('.search-btn');
		//获取下拉列表
		this.$searchLayer = this.$elem.find('.search-layer');
		

		/*2.初始化*/
		this.init();

		/*3.判断是否显示下拉层*/
		if(this.options.autocomplete)
			this.autocomplete();
	}
	Search.prototype = {
		constructor:Search,

		/*1.初始化绑定事件*/
		init:function(){
			/*1.1监听提交按钮事件*/
			this.$searchBtn.on('click',$.proxy(this.submit,this))
		},

		/*2.提交表单方法*/
		submit:function(){
			//如果输入框没有值则不提交数据
			if(!this.getInputVal()){
				return false;//阻值默认行为
			}
			//反之则提交数据
			this.$searchForm.trigger('submit');
		},

		/*3.获取输入框值的方法*/
		getInputVal:function(){
			//返回输入框中的信息
			//$.trim(str)去除字符串两边的空格并返回
			return $.trim(this.$searchInput.val());
		},

		/*4.显示下拉层内容的方法*/
		autocomplete:function(){
			//4.1初始化显示隐藏插件
			this.$searchLayer.showHide(this.options);

			//4.2监听输入框输入事件获取数据(通过jsonp获取数据)
			//通过getData方法获取数据
			this.$searchInput.on('input',$.proxy(this.getData,this))

			//4.3点击页面别的部分隐藏下拉层
			$(document).on('click',function(){
				//隐藏下拉层方法
				this.hideLayer();
			}.bind(this))

			//4.4获取焦点下拉层出现
			this.$searchInput.on('focus',function(){
				//输入框有值才显示下拉层
				if(this.getInputVal()){
					//显示下拉层方法
					this.showLayer();
				}
			}.bind(this));

			//4.5点击输入框按钮时阻值事件冒泡
			this.$searchInput.on('click',function(ev){
				ev.stopPropagation();
			})

			var _this = this;
			//4.6事件委托完成点击下拉列表每一项提交数据
			this.$elem.on('click','.search-item',function(){
				//1.获取点击项的内容
				var val = $(this).html();
				//2.设置输入框的值
				_this.setInputVal(val);
				//3.提交数据
				_this.submit();
			})
		},

		/*获取数据方法*/
		getData:function(){
			//如果没有数据
			if(!this.getInputVal()){
				//隐藏下拉层
				this.hideLayer();
				return;
			}
			$.ajax({

				/*1.拿到地址做字符串拼接*/
				url:this.options.url + this.getInputVal(),

				/*2.预期服务器返回的数据类型*/
				dataType:'jsonp',

				/*3.前后台约定接收数据的方法*/
				jsonp:'callback'
			})

			/*4.获取成功*/
			.done(function(data){
				this.$elem.trigger('getData',data)
			}.bind(this))

			/*5.获取失败*/
			.fail(function(err){
				this.$elem.trigger('getNoData')
			}.bind(this))
		},

		/*插入HTML方法*/
		appendHTML:function(html){
			this.$searchLayer.html(html);
		},

		/*显示下拉层方法*/
		showLayer:function(){
			this.$searchLayer.showHide('show')
		},

		/*隐藏下拉层方法*/
		hideLayer:function(){
			this.$searchLayer.showHide('hide')
		},

		/*存数据方法*/
		setInputVal:function(val){
			this.$searchInput.val(val)
		}
	}
	//当不传参数时默认配置信息
	Search.DEFAULTS = {
		//下拉层默认显示
		autocomplete:true,
		url:'https://suggest.taobao.com/sug?q=',
		js:true,
		mode:'slide'
	}


	//封装search插件
	$.fn.extend({
		search:function(options,val){
			//1.实现隐式迭代
			this.each(function(){//实现单例模式
				var $elem = $(this);
				var search = $elem.data('search');
				if(!search){
					options = $.extend({},Search.DEFAULTS,options);
					search = new Search($elem,options);
					//将实例信息存储在当前dom节点上
					$elem.data('search',search);
				}
				//第二次调用search则是调用实例上的方法
				if(typeof search[options] == 'function'){
					search[options](val);
				}
			})
		}
	})
})(jQuery);