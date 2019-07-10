
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
		}
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
		}
	/*共通函数结束*/

	/*顶部导航逻辑开始*/
		var $dropdown = $('.top .dropdown');
		
		var isLoaded = false;
		$dropdown.dropdown({
			js:true,
			mode:'slide'
		});

		/*懒加载*/
		$dropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
			/*当下拉层要显示的时侯才加载数据*/
			if(ev.type == 'dropdown-show'){
				//这里的this就是对应的每一个li
				
				/*1.将this包装成jQuery对象*/
				var $elem = $(this);

				/*2.获取下拉层*/
				//jQuery对象.find('CSS选择器')
				//查找jQuery对象中DOM元素的后代中符合选择器规则的元素。
				var $layer = $elem.find('.dropdown-layer');

				/*3.获取数据的地址*/
				var url = $elem.data('load');
				//如果没有url就不用加载数据
				if(!url) return;

				/*4.当数据已经加载就没有必要再发送请求*/
				//判断数据如果没有被加载则发送请求
				if(!$elem.data('isLoaded')){

					/*5.如果有url则获取数据*/
					//该方法会产生跨域(可使用sublimeServer方法解决)
					$.getJSON(url,function(data){
						console.log(data);

						/*5.1生成HTML*/
						var html = "";
						for(var i=0;i<data.length;i++){
							html += '<li><a href="'+data[i].url+'" class="dropdown-show">'+data[i].name+'</a></li>'
						}

						/*5.2模拟网络延迟*/
						setTimeout(function(){
							/*5.3将HTML插入到下拉层中*/
							//设置元素中的HTML:jQuery对象.html([val])
							$layer.html(html);

							//数据已经加载
							$elem.data('isLoaded',true);
						},1000);
					})
				}
			}
		})		
	/*顶部导航逻辑结束*/

	/*头部搜索区域开始*/
		var $search = $('.search');
		$search.on('getData',function(ev,data){
			var $elem = $(this);
			var $layer = $elem.find('.search-layer');
			//生成HTML结构(只接收5条数据)
			var data = data.result;
			var html = createSearchLayer(data,5)
			//将内容插入到搜索下拉层中
			$elem.search('appendHTML',html);
			//显示下拉层
			if(html = ""){
				$elem.search('hideLayer');
			//如果显示不为空则显示下拉层
			}else{
				$elem.search('showLayer');
			}
		})
		$search.on('getNoData',function(ev,){
			$elem.search('appendHTML','');
			$elem.search('hideLayer');
		})
		$search.search({});
		function createSearchLayer(data,max){
			var html = "";
			for(var i=0;i<data.length;i++){
				if(i >= max) break;
				html += '<li clsss="search-item">'+data[i][0]+'</li>'
			}
			return html;
		}
	/*头部搜索区域结束*/

	/*分类列表逻辑开始*/
		var $categoryDropdown = $('.focus .dropdown');
		$categoryDropdown.dropdown({
			js:true,
			mode:'slideLeftRight'
		});
		/*懒加载*/
		$categoryDropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
			/*当下拉层要显示的时侯才加载数据*/
			if(ev.type == 'dropdown-show'){
				//这里的this就是对应的每一个li
				
				/*1.将this包装成jQuery对象*/
				var $elem = $(this);

				/*2.获取下拉层*/
				//jQuery对象.find('CSS选择器')
				//查找jQuery对象中DOM元素的后代中符合选择器规则的元素。
				var $layer = $elem.find('.dropdown-layer');

				/*3.获取数据的地址*/
				var url = $elem.data('load');
				//如果没有url就不用加载数据
				if(!url) return;

				/*4.当数据已经加载就没有必要再发送请求*/
				//判断数据如果没有被加载则发送请求
				if(!$elem.data('isLoaded')){

					/*5.如果有url则获取数据*/
					//该方法会产生跨域(可使用sublimeServer方法解决)
					$.getJSON(url,function(data){
						console.log(data);

						/*5.1生成HTML*/
						var html = '';
						for(var i = 0;i<data.length;i++){
							html += '<dl class="category-details">';
							html +=	'	<dt class="category-details-title fl">';
							html +=	'		<a href="#" class="category-details-title-link">'+data[i].title+'</a>';
							html +=	'	</dt>';
							html +=	'	<dd class="category-details-item fl">';
							for(var j = 0;j<data[i].items.length;j++){
								html +=	'		<a href="#" class="link">'+data[i].items[j]+'</a>';
							}
							html +=	'	</dd>';
							html +=	'</dl>';
						}

						/*5.2模拟网络延迟*/
						setTimeout(function(){
							/*5.3将HTML插入到下拉层中*/
							//设置元素中的HTML:jQuery对象.html([val])
							$layer.html(html);

							//数据已经加载
							$elem.data('isLoaded',true);
						},1000);
					})
				}
			}
		})		
	/*分类列表逻辑结束*/

	/*轮播图逻辑开始*/
		var $coursel = $('.carousel .carousel-wrap');
		var item = {};//0:loaded 1:loaded
		var totalNum = $coursel.find('.carousel-img').length - 1;
		var totalLoadedNum = 0;
		var loadFn = null;
		//1.开始加载
		$coursel.on('coursel-show',loadFn = function(ev,index,elem){
			//判断图片有没有被加载
			if(!item[index]){
				$coursel.trigger('coursel-load',[index,elem]);
			}
		})
		//2.执行加载
		$coursel.on('coursel-load',function(ev,index,elem){
			console.log('will load img',index);
			var $elem = $(elem);
			var $img = $elem.find('.carousel-img');
			var imgUrl = $img.data('src');
			loadImage(imgUrl,function(){
				$img.attr('src',imgUrl);
			},function(){
				$img.attr('src','images/focus-carousel/placeholder.png');
			});
			//图片已经被加载
			item[index] = 'isLoaded';
			totalLoadedNum++;
			//所有图片都被加载则移除事件
			if(totalLoadedNum > totalNum){
				$coursel.trigger('coursel-loaded');
			}
		})
		//3.加载完毕
		$coursel.on('coursel-loaded',function(){
			$coursel.off('coursel-show',loadFn);
		})
		$coursel.coursel({});
	/*轮播图逻辑结束*/

	/*今日热销逻辑开始*/
		var $todaysCoursel = $('.todays .carousel-wrap');
		var $coursel = $('.carousel .carousel-wrap');
		$todaysCoursel.item = {};//0:loaded 1:loaded
		$todaysCoursel.totalNum = $coursel.find('.carousel-img').length - 1;
		$todaysCoursel.totalLoadedNum = 0;
		$todaysCoursel.loadFn = null;
		//1.开始加载
		$coursel.on('coursel-show',$todaysCoursel.loadFn = function(ev,index,elem){
			//判断图片有没有被加载
			if(!$todaysCoursel.item[index]){
				$coursel.trigger('coursel-load',[index,elem]);
			}
		})
		//2.执行加载
		$coursel.on('coursel-load',function(ev,index,elem){
			console.log('will load img',index);
			var $elem = $(elem);
			var $img = $elem.find('.carousel-img');
			var imgUrl = $img.data('src');
			loadImage(imgUrl,function(){
				$img.attr('src',imgUrl);
			},function(){
				$img.attr('src','images/focus-carousel/placeholder.png');
			});
			//图片已经被加载
			$todaysCoursel.item[index] = 'isLoaded';
			$todaysCoursel.totalLoadedNum++;
			//所有图片都被加载则移除事件
			if($todaysCoursel.totalLoadedNum > $todaysCoursel.totalNum){
				$coursel.trigger('coursel-loaded');
			}
		})
		//3.加载完毕
		$coursel.on('coursel-loaded',function(){
			$coursel.off('coursel-show',$todaysCoursel.loadFn);
		})
		$todaysCoursel.coursel({});
	/*今日热销逻辑结束*/
})(jQuery);