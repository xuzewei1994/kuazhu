(function($){
/*共通函数开始*/
	//1.只加载一次html
	function loadHtmlOnce($elem,callback){
		var url = $elem.data('load');
		//如果没有地址则无需加载数据
		if(!url) return;
		//判断数据如果没有被加载则发送请求
		if(!$elem.data('isLoaded')){
			$.getJSON(url,function(data){
				typeof callback == 'function' && callback($elem,data);
			})
		}
	};

	//2.加载图片
	function loadImage(imgUrl,success,error){
		var image = new Image();
		image.onload = function(){
			typeof success == 'function' && success(imgUrl);
		}
		image.onerror = function(){
			typeof error == 'function' && error(imgUrl);
		}
		image.src = imgUrl;
	};

	//3.轮播图懒加载
	function courselLazyLoad($elem){
		var item = {};//0:loaded 1:loaded
		var totalNum = $elem.find('.carousel-img').length - 1;
		var totalLoadedNum = 0;
		var loadFn = null;
		/*1.开始加载*/
		$elem.on('coursel-show',loadFn = function(ev,index,elem){
			//判断图片有没有被加载
			if(!item[index]){
				$elem.trigger('coursel-load',[index,elem]);
			}
		})
		/*2.执行加载*/
		$elem.on('coursel-load',function(ev,index,elem){
			var $elem = $(elem);
			var $imgs = $elem.find('.carousel-img');
			$imgs.each(function(){
				var $img = $(this);
				var imgUrl = $img.data('src');
				loadImage(imgUrl,function(){
					$img.attr('src',imgUrl);
				},function(){
					$img.attr('src','images/focus-carousel/placeholder.png');
				});
			})
			/*2.2图片已经被加载*/
			item[index] = 'isLoaded';
			totalLoadedNum++;
			/*2.3所有图片都被加载则移除事件*/
			if(totalLoadedNum > totalNum){
				$elem.trigger('coursel-loaded');
			}
		})
		/*3.加载完毕*/
		$elem.on('coursel-loaded',function(){
			$elem.off('coursel-show',loadFn);
		})
	}

	//4.楼层图片懒加载
	function floorImgLazyLoad($elem){
		var item = {};//0:loaded 1:loaded
		var totalNum = $elem.find('.floor-img').length - 1;
		var totalLoadedNum = 0;
		var loadFn = null;
		//1.开始加载
		$elem.on('tab-show',loadFn = function(ev,index,elem){
			//判断图片有没有被加载
			if(!item[index]){
				$elem.trigger('tab-load',[index,elem]);
			}
		})
		//2.执行加载
		$elem.on('tab-load',function(ev,index,elem){
			// console.log('will load img',index);
			var $elem = $(elem);
			var $imgs = $elem.find('.floor-img');
			$imgs.each(function(){
				var $img = $(this);
				var imgUrl = $img.data('src');
				loadImage(imgUrl,function(){
					$img.attr('src',imgUrl);
				},function(){
					$img.attr('src','images/focus-carousel/placeholder.png');
				});
			})
			//图片已经被加载
			item[index] = 'isLoaded';
			totalLoadedNum++;
			//所有图片都被加载则移除事件
			if(totalLoadedNum > totalNum){
				$elem.trigger('tab-loaded');
			}
		})
		//3.加载完毕
		$elem.on('tab-loaded',function(){
			$elem.off('tab-show',loadFn);
		})
	}

	//5.楼层html懒加载
	function floorHtmlLazyLoad($elem){
		var item = {};//0:loaded 1:loaded
		var totalNum = $elem.length - 1;
		var totalLoadedNum = 0;
		var loadFn = null;
		//1.开始加载
		$doc.on('floor-show',loadFn = function(ev,index,elem){
			//判断图片有没有被加载
			if(!item[index]){
				$doc.trigger('floor-load',[index,elem]);
			}
		})
		//2.执行加载
		$doc.on('floor-load',function(ev,index,elem){
			//1.生成html结构
			//2.加载html
			//3.楼层图片懒加载
			//4.激活选项卡
			//楼层已经被加载
			item[index] = 'isLoaded';
			totalLoadedNum++;
			//所有图片都被加载则移除事件
			if(totalLoadedNum > totalNum){
				$doc.trigger('floor-loaded');
			}
		})
		//3.加载完毕
		$doc.on('floor-loaded',function(){
			$doc.off('floor-show',loadFn);
		})
	}
/*共通函数结束*/

/*顶部导航逻辑开始*/
	var $topDropdown = $('.top .dropdown');
	$topDropdown.dropdown({
		js:true,
		mode:'slide'
	});

	/*1.加载数据*/
	$topDropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		if(ev.type == 'dropdown-show'){
			loadHtmlOnce($(this),buildTopLayer)
		}
	});

	/*2.生成顶部下拉层结构*/
	function buildTopLayer($elem,data){
		var $layer = $elem.find('.dropdown-layer');
		/*2.1生成HTML*/
		var html = '';
		for(var i = 0;i<data.length;i++){
			html += '<li><a href="'+data[i].url+'">'+data[i].name+'</a></li>';
		}
		/*2.2将HTML插入到下拉层中*/
		//模拟网络延迟
		setTimeout(function(){
			$layer.html(html);
			/*2.3数据已经加载*/
			$elem.data('isLoaded',true);
		},1000);
	}
/*顶部导航逻辑结束*/

/*头部搜索区域开始*/
	var $search = $('.search');
	/*1.成功获取并处理数据*/
	$search.on('getData',function(ev,data){
		var $elem = $(this);
		var $layer = $elem.find('.search-layer');
		//1.生成html结构
		var data = data.result;
		var html = createSearchLayer(data,10);
		//2.将内容插入到搜索下拉层中
		$elem.search('appendHTML',html);
		//3.显示下拉层
		if(html == ''){
			$elem.search('hideLayer');
		}else{
			$elem.search('showLayer');
		}
	})
	/*2.获取数据失败处理*/
	$search.on('getNoData',function(ev){
		$elem.search('appendHTML','');
		$elem.search('hideLayer');
	});

	$search.search({});
	/*3.生成搜索下拉列表html结构并且可以控制数据条目*/
	function createSearchLayer(data,max){
		var html = '';
		for(var i = 0 ;i<data.length;i++){
			if(i >= max) break;
			html += '<li class="search-item">'+data[i][0]+'</li>'
		}
		return html;
	}
/*头部搜索区域结束*/

/*分类列表逻辑开始*/
	var $categoryDropdown = $('.focus .dropdown');
	$categoryDropdown.dropdown({
		js:true,
		mode:'fade'
	});
	//加载数据
	$categoryDropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		if(ev.type == 'dropdown-show'){
			loadHtmlOnce($(this),buildCategoryLayer);
		}
	});

	//生成分类列表左拉层结构
	function buildCategoryLayer($elem,data){
		var $layer = $elem.find('.dropdown-layer');
		//生成HTML
		var html = '';
		for(var i = 0;i<data.length;i++){
			html += '<dl class="category-details">';
			html +=	'	<dt class="category-details-title fl">';
			html +=	'		<a href="#" class="category-details-title-link">'+data[i].title+'</a>';
			html +=	'	</dt>';
			html +=	'	<dd class="category-details-item fl">';
			for(var j = 0;j<data[i].items.length;j++){
				html +=	'<a href="#" class="link">'+data[i].items[j]+'</a>';
			}
			html +=	'	</dd>';
			html +=	'</dl>';
		}
		//将HTML插入到下拉层中
		//模拟网络延迟
		setTimeout(function(){
			$layer.html(html);
			//数据已经加载
			$elem.data('isLoaded',true);
		},1000);
	}
/*分类列表逻辑结束*/

/*轮播图逻辑开始*/
	var $coursel = $('.carousel .carousel-wrap');
	courselLazyLoad($coursel);
	$coursel.coursel({});
/*轮播图逻辑结束*/

/*今日热销逻辑开始*/
	var $todaysCoursel = $('.todays .carousel-wrap');
	courselLazyLoad($todaysCoursel);
	$todaysCoursel.coursel({});
/*今日热销逻辑结束*/

/*楼层逻辑开始*/
	var $floor = $('.floor');
	var $win = $(window);
	var $doc = $(document);

	//判断楼层是否在可视区
	function isVisible($elem){
		return ($win.height() + $win.scrollTop() > $elem.offset().top) 
		&& ($elem.offset().top + $elem.height() > $win.scrollTop())
	};

	$doc.on('floor-show',function(ev,index,elem){
		// console.log(index,elem);
	})

	function timeToShow(){
		$floor.each(function(index,elem){
			if(isVisible($(elem))){
				console.log(index,'in show.......');
				$doc.trigger('floor-show',[index,elem]);
			}
		})
	}

	$win.on('load scroll resize',function(){
		clearTimeout($floor.showTimer);
		$floor.showTimer = setTimeout(timeToShow,200);
	})
	// $floor.on('tab-show',function(ev,index,elem){
	// 	console.log(index,elem);
	// })
	
	/*遍历每一个楼层实现图片懒加载*/
	// $floor.each(function(){
	// 	floorImgLazyLoad($(this));
	// })
	$floor.tab({});
/*楼层逻辑结束*/
})(jQuery);