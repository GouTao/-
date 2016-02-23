			var itemContent = $(".show_item");//item容器
			var items = [];
			var noIcon = $("#nothing");
			var windowHeight;
			$(function(){
				checkSys();
				getData();
				//切换搜索
				$("#input_change").on("click",function(e){
					if($("#input_change > span").html() == "名称查询")
					{
						$("#input_change > span").html("支部查询");
					}
					else
					{
						$("#input_change > span").html("名称查询");
					}
				})
				//搜索
				
				$("#searchBtn").on("click",function(e){
					
					var txt = $("#searchKey").val();
					
					var command = $("#input_change > span").html() == "名称查询"?"findByName":"findByArea";
					console.log(command);
					
					if(txt!=""){
						var sendData=new Object();
						sendData.command=command;//getList
						sendData.findKey = txt;
						var sendMsg=JSON.stringify(sendData);
						$.ajax({
							url:"http://119.29.75.226:11911",
							async:true,
							type: "post",
							dataType: "json",
							data:{"data":sendMsg},
							timeout:500,
							success: function(data, textStatus)
							{
								itemContent.empty();
								console.log(data);
								if(data.data.length == 0){
								
									noIcon.css("display","inline-block");
									itemContent.append(noIcon);
									return;
								}
								$.each(data.data, function() {
									var name = this.name;//名称
									var pcUrl = this.cover;//图片地址
									var showNum = this.showNum;//热读
									var address = this.code;//链接地址
									var time = this.createdTime;//创建时间
									var type = this.type;//所属类型
									
									var item = creatIconItem(name,pcUrl,address,showNum,time,type);
									console.log(this);
									itemContent.append(item);
								});
							},
							error:function(){

							}
						});
					}
					
				})
				
				//返回上级界面
				$("#returnToMain").on("click",function(e){
					open("index.html","_self");
				})
				
				$("li").each(function(i){
					$(this).on("mousedown",function(e){
	  
						var command = $(this).html();
						if(command.charAt(0) == "最")//时间热度
						{
							itemContent.empty();
							switch(command)
							{
								case "最少浏览":
										items.sort(function(a,b){return Number(a.attr("showNum"))>Number(b.attr("showNum"))?1:-1});
										for(var i = 0;i<items.length;i++){
											console.log(items[i].attr("showNum"));
											itemContent.append(items[i]);
										}
									break;
								case "最多浏览":
										items.sort(function(a,b){return Number(a.attr("showNum"))<Number(b.attr("showNum"))?1:-1});
										for(var i = 0;i<items.length;i++){
											console.log(items[i].attr("showNum"));
											itemContent.append(items[i]);
										}
									break;
								case "最新发布":
										items.sort(function(a,b){return Number(a.attr("time"))<Number(b.attr("time"))?1:-1});
										for(var i = 0;i<items.length;i++){
											console.log(items[i].attr("time"));
											itemContent.append(items[i]);
										}
									break;
								case "最早发布":
										items.sort(function(a,b){return Number(a.attr("time"))>Number(b.attr("time"))?1:-1});
										for(var i = 0;i<items.length;i++){
											console.log(items[i].attr("time"));
											itemContent.append(items[i]);
										}
									break;
							}
						}
						else//所属类型
						{
	
							itemContent.empty();
							for(var i = 0;i<items.length;i++)
							{
								if(items[i].attr("type") == command)
								{
									itemContent.append(items[i]);
									return;
								}
							}
							noIcon.css("display","inline-block");
							itemContent.append(noIcon);
						}
						return;
					})
				})
				
				
//				$(".show_nav_2_btn").on("mousedown",function(e){
//
//					var command = $(this).html();
//					if(command.charAt(0) == "最")//时间热度
//					{
//						itemContent.empty();
//						switch(command)
//						{
//							case "最少浏览":
//									items.sort(function(a,b){return Number(a.attr("showNum"))>Number(b.attr("showNum"))?1:-1});
//									for(var i = 0;i<items.length;i++){
//										console.log(items[i].attr("showNum"));
//										itemContent.append(items[i]);
//									}
//								break;
//							case "最多浏览":
//									items.sort(function(a,b){return Number(a.attr("showNum"))<Number(b.attr("showNum"))?1:-1});
//									for(var i = 0;i<items.length;i++){
//										console.log(items[i].attr("showNum"));
//										itemContent.append(items[i]);
//									}
//								break;
//							case "最新发布":
//									items.sort(function(a,b){return Number(a.attr("time"))<Number(b.attr("time"))?1:-1});
//									for(var i = 0;i<items.length;i++){
//										console.log(items[i].attr("time"));
//										itemContent.append(items[i]);
//									}
//								break;
//							case "最早发布":
//									items.sort(function(a,b){return Number(a.attr("time"))>Number(b.attr("time"))?1:-1});
//									for(var i = 0;i<items.length;i++){
//										console.log(items[i].attr("time"));
//										itemContent.append(items[i]);
//									}
//								break;
//						}
//					}
//					else//所属类型
//					{
//
//						itemContent.empty();
//						for(var i = 0;i<items.length;i++)
//						{
//							if(items[i].attr("type") == command)
//							{
//								itemContent.append(items[i]);
//								return;
//							}
//						}
//						noIcon.css("display","inline-block");
//						itemContent.append(noIcon);
//					}
//					return;
//				})
			})
			$(window).resize(onResize);
			function onResize(){
//				windowHeight = $(window).;
				console.log(windowHeight);
			}
			function checkSys() { 
				var sUserAgent = navigator.userAgent.toLowerCase();
	            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	            var bIsAndroid = sUserAgent.match(/android/i) == "android";
	            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	            console.log("您的浏览设备为：");
	            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
	                 return "phone";
	            } else {
	                 return "pc";
	            }
			} 

			
			/**
			 * 
			 * @param 名称
			 * @param 图片地址
			 * @param 链接地址
			 * @param 热度
			 * @param 创建时间
			 * @paran 类型
			 */
			function creatIconItem(name,pc,url,showNum,time,type){
				var $item=$(
					"<div  class='item'  showNum='"+showNum+"' time='"+time+"' type='"+type+"'>"+
						"<img style='width: 100%;' src='"+pc+"'/><br /><br />"+
						"<p style='color: #00A1CB;'>"+name+"</p>"+
						"<p><b>行业类型：</b>"+type+"</p>"+
						"<p><b>浏览热度：</b>"+showNum+"</p>"+
						"<p><b>发布时间：</b>"+new Date(parseInt(time)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ") +"</p>"+
						"<p class='url' style='display: none;'>"+url+"</p>"+
					"</div>"
				)
//				$item.css({
//					"width":"300px",
//					"background-color":"white",
//					"padding":"5px",
//					"margin":"40px",
//					 "display":"inline-block",
//					 "box-shadow":"2px 2px 10px #cccccc"
//				})
				$item.children('p').each(function(){
					$(this).css({
						"padding":"0 10px",
					})
				})
				$item.on('mousedown ',function(e){
					console.log(1);
					open($(e.currentTarget).children('.url').html(),"_blank");
				})
				return $item;
			}

			//初始化数据
			function getData(){
				var sendData=new Object();
				sendData.command="getList";//getList
				var sendMsg=JSON.stringify(sendData);
				$.ajax({
					url:"http://119.29.75.226:11911",
					async:true,
					type: "post",
					dataType: "json",
					data:{"data":sendMsg},
					timeout:500,
					success: function(data, textStatus)
					{
						$.each(data.data, function() {
							var name = this.name;//名称
							var pcUrl = this.cover;//图片地址
							var showNum = this.showNum;//热读
							var address = this.code;//链接地址
							var time = this.createdTime;//创建时间
							var type = this.type;//所属类型
							
							var item = creatIconItem(name,pcUrl,address,showNum,time,type);
							items.push(item);

							itemContent.append(item);
						});
					},
					error:function(){
//						console.log("XX");
					}
				});
			}
			