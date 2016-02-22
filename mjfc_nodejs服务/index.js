var port=11911;
var http=require("http");
var url=require("url");
var querystring = require("querystring");
var md=require("mongodb");
var ms=new md.Server('localhost',27011,{auto_reconnect: true, poolSize: 10});
var db=new md.Db('mjData',ms);
var ObjectID = require('mongodb').ObjectID;

db.open(function(){
	console.log('dbOpen');

	http.createServer(function(req,res){
		req.setEncoding("utf-8");
		var postData="";
		var theRes=res;
		//接收数据中
		req.addListener("data",function(postDataChunk){
			postData+=postDataChunk;
		});
		//数据接收完毕
		req.addListener("end",function(){
			try{
				var params=JSON.parse(querystring.parse(postData)["data"]);
				checkData(params,theRes);
			}catch(e){
				log("Data with wrong information:\n"+e.message);
			}
		});
	}).listen(port,function(){
		log("HttpServer running at PORT:"+port);
	});
})



function checkData(data,resIn){
	if(data.command=="refresh"){
		var getHttp=require("http");
		getHttp.get('http://wcj.sanploy.cn/index.php?c=scene&a=promotion&pageNo=1&pageSize=9',function(res){
			var chunk;
			res.on('data',function(data){
				chunk+=data;
			})
			res.on('end',function(){
				var jsonStr=chunk.substr(9,chunk.length-1);
				var resData=JSON.parse(jsonStr);
				if(typeof resData['success']!=undefined){
					if(resData.success==true){
						if(resData.list.length!=0){
							refreshData(resData.list,resIn);
						}
						else{
							sendData(resIn,"未能获取场景列表 data none",false);
						}
					}
					else{
						sendData(resIn,"未能获取场景列表,data false",false);
					}
				}
				else{
					sendData(resIn,"未能获取场景列表,data wrong",false);
				}
			})
		})
	}
	if(data.command=="getList"){
		db.collection('showSence',function(err,collection){
			collection.find({}).toArray(function(err,bars){
				if(err){
					sendData(resIn,'no data',false)
				}
				else{
					sendData(resIn,bars,true);	
				}
				
			})
		})
	}
	if(data.command=="upDate"){
		if(data._id==undefined){
			sendData(resIn,'缺少_id值',false);
		}
		else if(data.theType==undefined){
			sendData(resIn,'缺少type值',false);
		}
		else if(data.belong==undefined){
			sendData(resIn,'缺少belong值',false);
		}
		else{
			db.collection('showSence',function(err,collection){
				if(err){
					sendData(resIn,'',false);
				}
				else{
					var updateCondition={"_id":new ObjectID(data._id)};
					var mod={$set:{"type":data.theType,"belong":data.belong}};
					collection.update(updateCondition,mod,function(err,data){
						if(err){
							sendData(resIn,'',false);
						}
						else{
							sendData(resIn,data,true);
						}
					})
				}
			})
		}
	}
	if(data.command=="findByName"){
		if(data.findKey==undefined){
			sendData(resIn,'缺少搜索关键字',false);
		}
		else{
			db.collection('showSence',function(err,collection){
				if(err){
					sendData(resIn,'',false);
				}
				else{
					var reg=new RegExp("\\"+data.findKey+".*","");
					var findCondition={"name":{$regex:reg}};
					collection.find(findCondition).toArray(function(err,bars){
						if(err){
							sendData(resIn,'',false);
						}
						else{
							sendData(resIn,bars,true);
						}
					})
				}
			})
		}
	}
	if(data.command=="infoBoard"){
		if(data.user==undefined){
			sendData(resIn,'缺少发布者',false);
		}
		else if(data.time==undefined){
			sendData(resIn,'缺少发布时间',false);
		}
		else if(data.content==undefined){
			sendData(resIn,'缺少发布内容',false);
		}
		else{
			db.collection('infoBoard',function(err,collection){
				if(err){
					sendData(resIn,'',false);
				}
				else{
					var newInfo=new Object();
					newInfo.user=data.user;
					newInfo.time=data.time;
					newInfo.content=data.content;
					collection.insert(newInfo,function(err,data){
						if(err){
							sendData(resIn,'',false);
						}
						else{
							sendData(resIn,data,true);
						}
					})
				}
			})
		}
	}
	if(data.command=="delInfo"){
		if(data.delID==undefined){
			sendData(resIn,'',false);
		}
		else{
			db.collection('infoBoard',function(err,collection){
				if(err){
					sendData(resIn,'',false);
				}
				else{
					var delCondition={"_id":new ObjectID(data.delID)};
					collection.remove(delCondition,function(err,data){
						if(err){
							sendData(resIn,'',false);
						}
						else{
							sendData(resIn,data,true);
						}
					})
				}
			})
		}
	}
	if(data.command=="getInfo"){
		db.collection("infoBoard",function(err,collection){
			if(err){
				sendData(resIn,'',false);
			}
			else{
				collection.find({}).toArray(function(err,bars){
					if(err){
						sendData(resIn,'',false);
					}
					else{
						sendData(resIn,bars,true);
					}
				})
			}
		})
	}
	if(data.command=="getType"){
		db.collection('industry',function(err,collection){
			if(err){
				sendData(resIn,'',false);
			}
			else{
				collection.find({}).toArray(function(err,bars){
					if(err){
						sendData(resIn,'',false);
					}
					else{
						sendData(resIn,bars,true);
					}
				})
			}
		})
	}
	if(data.command=="findByArea"){
		if(data.findKey==undefined){
			sendData(resIn,'缺少搜索关键字',false);
		}
		else{
			db.collection('showSence',function(err,collection){
				if(err){
					sendData(resIn,'',false);
				}
				else{
					var reg=new RegExp("\\"+data.findKey+".*","");
					var findCondition={"belong":{$regex:reg}};
					collection.find(findCondition).toArray(function(err,bars){
						if(err){
							sendData(resIn,'',false);
						}
						else{
							sendData(resIn,bars,true);
						}
					})
				}
			})
		}
	}
	if(data.command=="delSence"){
		if(data._id==undefined){
			sendData(resIn,'缺少_id',false);
		}
		else{
			db.collection('showSence',function(err,collection){
				if(err){
					sendData(resIn,'',false);
				}
				else{
					var delCondition={"_id":new ObjectID(data.delID)};
					collection.remove(delCondition,function(err,data){
						if(err){
							sendData(resIn,'',false);
						}
						else{
							sendData(resIn,data,true);
						}
					})
				}
			})
		}
	}
}

function refreshData(baseData,target){
	db.collection('showSence',function(err,collection){
		if(err){
			sendData(target,'no data',false);
		}
		else{
			collection.find({}).toArray(function(err,bars){
				if(err){
					sendData(target,'no data',false);
				}
				else{
					compairData(baseData,bars,target);
				}
			})
		}
	})
}

function compairData(arr1,arr2,target){
	for(var i=arr1.length;i>0;i--){
		for(var j=0;j<arr2.length;j++){
			if(arr1[i-1].id==arr2[j].id){
				arr1.splice(i-1,1);
				break
			}
		}
	}
	
	if(arr1.length==0){
		sendData(target,arr2,true);
	}
	else{
		for(var n=0;n<arr1.length;n++){
			db.collection('showSence',function(err,collection){
				if(err){
					sendData(target,'no data',false);
				}
				else{
					var newData=new Object();
					newData.id=arr1[n].id;
					newData.name=arr1[n].name;
					newData.showNum=arr1[n].showCount;
					newData.type="";
					newData.cover="http://wcj.sanploy.cn/Uploads/"+arr1[n].cover;
					newData.code="http://wcj.sanploy.cn/v-"+arr1[n].code;
					newData.createdTime=Date.parse(new Date(arr1[n].createTime));
					newData.belong="";
					collection.insert(newData,function(err,data){
						if(err){
							sendData(target,'no data',false);
						}
					})
				}
			})
		}
		db.collection('showSence',function(err,collection){
			if(err){
				sendData(target,'no data',false);
			}
			else{
				collection.find({}).toArray(function(err,bars){
					if(err){
						sendData(target,'no data',false);
					}
					else{
						if(bars.length==0){
							sendData(target,'no data',false);
						}
						else{
							sendData(target,bars,true);
						}
					}
				})
			}
		})
	}
}

function sendData(target,resData,ifSuccess){
	target.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*","Cache-Control":"no-cache, no-store, must-revalidate","Pragma":"no-cache","Expires":"0"});
	if(ifSuccess){
		var sucInfo=new Object();
		sucInfo.result="success";
		sucInfo.msg="";
		sucInfo.data=resData;
		target.write(JSON.stringify(sucInfo));	
	}
	else{
		var errInfo=new Object();
		errInfo.result="failed";
		errInfo.msg=resData;
		target.write(JSON.stringify(errInfo));
	}
	target.end();
}

function log(str){
	console.log("==>>"+str);
}