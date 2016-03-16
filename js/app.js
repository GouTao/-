var ifMj=false,ifName=false,ifTel=false,ifGroup=false;
var regCode="";
var infoArr=[],infoLength=0,tempShow=0,changeTime;

$(window).resize(function(){
	$(".forFooter").css('height',$(".footer").height());
})
$(document).ready(function(){
	var getInfo=new Object();
	getInfo.command="getInfo";
	
	$.ajax({
		type:"post",
		url:"http://119.29.75.226:11911",
		async:true,
		data:{"data":JSON.stringify(getInfo)},
		dataType:"json",
		success:function(res){
			if(res.result=="success"){
				infoArr=res.data;
				createInfoBoard();
			}
		},
		error:function(){
			console.log("err");
		}
	});
	
	
	$(".forFooter").css('height',$(".footer").height());
	
	$("#enterBtn").bind("click",function(){
		open("show.html","_self");
	});
	$("#regBtn").bind("click",function(){
		$("#mj").val()==''?ifMj=false:ifMj=true;
		$("#name").val()==''?ifName=false:ifName=true;
		ifTel=regTel($("#tel").val());
		$("#group").val()==''?ifGroup=false:ifGroup=true;
		
		if(ifName&&ifGroup&&ifTel){
			regCode="";
			for(var i=0;i<6;i++){
				regCode+=Math.floor((Math.random()*10)).toString();
			}
			$("#codePre").html(regCode);
			$("#myModal2").modal();
		}
		else{
			alert("请确保您已经按要求完整填写姓名、联系方式、企业或团体名称三项内容");
		}
	})
	$("#subBtn").unbind("click").bind("click",function(){
		if($("#code").val()==regCode){
			var sendObj=new Object;
			sendObj.command="sendEmail";
			sendObj.branchName="";
			sendObj.name=$("#name").val();
			sendObj.phoneNum=$("#tel").val();
			sendObj.organization=$("#group").val();
			var sendStr=JSON.stringify(sendObj);
			$.ajax({
				type:"post",
				url:"http://115.159.39.71:6007",
				async:true,
				data:{"data":sendStr},
				dataType:"json",
				success:function(res){
					if(res.result=="success"){
						alert("发送申请信息成功。");
						$("#name").val("");
						$("#tel").val("");
						$("#group").val("");
						$("#myModal2").modal("hide");
					}
					else{
						aler("发送失败，请尝试重新发送信息。");
						$("#myModal2").modal("hide");
					}
					
				},
				error:function(){
					alert("链接失败，请尝试重新发送信息。");
					$("#myModal2").modal("hide");
				}
			});
		}
		else{
			alert("验证码错误！")
		}
	})
})

function createInfoBoard(){
	for(var i=0;i<infoArr.length;i++){
		var $content=$(
			"<div>"+
				"<p style='text-indent: 0;font-size: 1.1em;'><span style='font-weight:bold'>发布者:</span><small>"+infoArr[i].user+"</small></p>"+
				"<p style='text-indent: 0;font-size: 1.1em;'><span style='font-weight:bold'>发布时间:</span><small>"+infoArr[i].time+"</small></p>"+
				"<p style='text-indent: 0;font-size: 1.1em; '><span style='font-weight:bold'>内容:</span><small style='word-break:break-all'>"+infoArr[i].content+"</small></p>"+
			"</div>"	
		)
		if(i!=0){
			$content.css('display',"none");
		}
		$("#infoContent").append($content);
	}
	
	infoLength=$("#infoContent").children().length;
	$("#tempNum").html(tempShow+1);
	$("#totalNum").html(infoLength);
	
	infoChange();
	
	$("#lastBtn").on('click',function(){
		$($("#infoContent").children()[tempShow]).css("display","none");
		tempShow==0?tempShow=infoLength-1:tempShow=tempShow-1;
		$($("#infoContent").children()[tempShow]).css("display","block");
		$($("#infoContent").children()[tempShow]).removeClass("animated fadeIn");
		$($("#infoContent").children()[tempShow]).addClass("animated fadeIn");
		$("#tempNum").html(tempShow+1);
		clearInterval(changeTime);
		infoChange();
	});
	$("#nextBtn").on('click',function(){
		$($("#infoContent").children()[tempShow]).css("display","none");
		tempShow==infoLength-1?tempShow=0:tempShow=tempShow+1;
		$($("#infoContent").children()[tempShow]).css("display","block");
		$($("#infoContent").children()[tempShow]).removeClass("animated fadeIn");
		$($("#infoContent").children()[tempShow]).addClass("animated fadeIn");
		$("#tempNum").html(tempShow+1);
		clearInterval(changeTime);
		infoChange();
	})
	
	
}

function infoChange(){
	changeTime=setInterval(function(){
		$($("#infoContent").children()[tempShow]).css("display","none");
		tempShow==infoLength-1?tempShow=0:tempShow=tempShow+1;
		$($("#infoContent").children()[tempShow]).css("display","block");
		$($("#infoContent").children()[tempShow]).removeClass("animated fadeIn");
		$($("#infoContent").children()[tempShow]).addClass("animated fadeIn");
		$("#tempNum").html(tempShow+1);
	},5000);
}

function regTel(tel){
	var rex=/^1\d{10}$/;
	return rex.test(tel);
}