(function(){
'use strict';	
var wsConsole={
	consoleLogDisabled:false,	
	remoteMode:true,
	sendLog : true,	
	showStack:true,
	autoReconnect:true,	
	//毫秒
	reconnectInterval:1000,
	//尝试X次后 弹出提示
	reconnectTimes:5,
	webSocketUrl:'ws://192.168.2.90:3000/',
	send:function(e){},
	//建立连接前保存log数据
	saveLog : [],
	reconnectCount:0,
	wsReady : false,
	help:function(){
		console.info('101 ');
		
	},
	setConfig:function(){
		//设置远程wsConsole
	},
	sendCss:function(){
		//设置远程css
	},
	sendScript:function(){
		//远程执行js
	}
}

var console = window.console || {};
if(wsConsole.consoleLogDisabled){
	console.info('禁用console.log');	
	console.log=function(){}
	return;
}

if(!wsConsole.remoteMode){
	console.info('远程console.log已关闭');
	return;
}
if(!wsConsole.sendLog){	
	console.info('不发送console.log数据');
}
// 重写console.log方法，发送到电脑浏览器


var oldLog = console.log;
var slice = [].slice;
var wsReady=false;
var Object=window.Object||{};
var JSON=window.JSON||{};
var jsonObj={
	_strMapToObj:function(strMap){
		let obj= Object.create(null);
		for (let[k,v] of strMap) {
		  obj[k] = v.toString();
		 
		}
		return obj;
	  },
	  /**
	  *map转换为json
	  */
	_mapToJson:function(map) {
	
	  return JSON.stringify(this._strMapToObj(map));
	  },

	_objToStrMap:function(obj){
	  let strMap = new Map();
	  for (let k of Object.keys(obj)) {
		strMap.set(k,obj[k]);
		
	  }
	  return strMap;
	},
	 /**
	  *json转换为map
	  */
	_jsonToMap:function(jsonStr){
		return this._objToStrMap(JSON.parse(jsonStr));
	  }
}

console.log = function(){
	/*
	columnNumber: 9
​
fileName: "debugger eval code"
​
lineNumber: 2
​
stack: "@debugger eval code:2:9\n"*/
	
	
var args=[].slice.call(arguments);
var stack='';
console.info.apply(console.trace, args);
 if(wsConsole.showStack){
	try{
		throw new Error();
	}catch(e){
		stack=e['stack'].replace(/^error/i,'');
		args.push('\n'+stack);
	}
 }
	
    
	
	if(!wsConsole.sendLog) return;
	
	//要发送的数据-------
    var msg = '',jn=[], len=args.length;
	var obj,type;
    for(var i = 0; i < len; i++){
        obj = args[i];
		
        if(typeof obj !== 'string' && typeof obj !== 'number'){
            try{
				type=Object.prototype.toString.call(obj);
				
				if(/Html/i.test(type)){
					jn.push({'html':obj.tagName});					
				}else if(/Function/i.test(type)){					
					jn.push({'function':obj.toString()});					
				}else if(/Array/i.test(type)){			
					jn.push({'array':JSON.stringify(obj)});					
				}else if(/Map/i.test(type)){				
					jn.push({'map':jsonObj._mapToJson(obj)});				
				}else if(/object Object/i.test(type)){
					jn.push({'json':JSON.stringify(obj)});
				}else {
					jn.push({'object':JSON.stringify(obj)});	
				}				
            }catch(e){ };
        }else if(typeof obj === 'string'){		
			jn.push({'string':obj});
        }else if(typeof obj === 'number'){			
			jn.push({'number':obj.toString()});
		} else {			
			jn.push({'unknow':obj.toString()});
		}		
    }//--for

	msg=JSON.stringify(jn);
	//建立连接前保存数据
	wsReady?wsConsole.send(msg):wsConsole.saveLog.push(msg);
};
//监听error
window.addEventListener('error',  args => {
	 //for(var i in args){	//	 console.log(i,typeof args[i],rgs[i]);	
	 //}
	
	let {error,filename,lineno,colno}=args;
	console.log('wsERROR',{error___:error.toString(),filename:filename+' line:'+lineno+' col:'+colno});
	return true;
 
}, true);


//<meta http-equiv="pragma" content="no-cache">
var noCache=function(){
	var doc=document;
	var head = doc.getElementsByTagName("head")[0];
	var meta=doc.createElement("meta");
	meta.setAttribute('http-equiv','pragma');
	meta.setAttribute('content','no-cache');
	head.appendChild(meta);
	// noCache=()=>{};
}
window.addEventListener('load',noCache,true);

function scriptAndStyle(s){
	if(s.indexOf('@@wsConsole@@script@@')===0){
			s=s.replace(/^@@wsConsole@@script@@/,'');
			var text=document.createTextNode(s);				
			var check=document.getElementById( "@@wsConsole@@script@@");
			if(check)check.parentNode.removeChild(check);
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement( "script");	
			script.id='@@wsConsole@@script@@';
			script.appendChild(text);
			head.appendChild(script); 		
			return true;
		}
	if(s.indexOf('@@wsConsole@@css@@')===0){
		s=s.replace(/^@@wsConsole@@css@@/,'');
		var text=document.createTextNode(s);				
		var check=document.getElementById( "@@wsConsole@@css@@");
		if(check)check.parentNode.removeChild(check);
		var head = document.getElementsByTagName("head")[0];
		var css = document.createElement( "style");	
		css.id='@@wsConsole@@css@@';
		css.appendChild(text);
		head.appendChild(css); 	
		return  true;
	}/**/
}

// 设置服务器地址
var ws;// = new WebSocket(wsConsole.webSocketUrl);
var timer;
var reconnectFunc;
function createSocket(){
	ws=new WebSocket(wsConsole.webSocketUrl)
	wsConsole.reconnectCount===0&&oldLog && oldLog('connecting...');
	 ++wsConsole.reconnectCount;
	 // onopen 连接触发 
	ws.onopen=function(){ 
		wsConsole.reconnectCount=0;
		clearTimeout(timer);
		console.log("websocket open. ["+navigator.userAgent+']');		
		wsConsole.send=function(str){		
			ws.send(str);
		}
		for(var i in wsConsole.saveLog){
			wsConsole.send(wsConsole.saveLog[i]);
		}
		wsConsole.saveLog=[];
		wsReady=true;
		
		wsConsole.sendScript=function(str){
			
			ws.send('@@wsConsole@@script@@'+str);
			scriptAndStyle('@@wsConsole@@script@@'+str);
		}
		wsConsole.sendCss=function(str){
			
			ws.send('@@wsConsole@@css@@'+str);
			scriptAndStyle('@@wsConsole@@css@@'+str);
		}
		

		
	/*	document.getElementById('sendScript').onclick=function(){
			
			wsConsole.sendScript(document.getElementById('wsConsoleScript').value);
			
		}
		
		
		document.getElementById('sendCss').onclick=function(){
			
			wsConsole.sendCss(document.getElementById('wsConsoleCss').value);
		}
		document.getElementById('wsConsoleCss').onkeyup=function(){
			wsConsole.sendCss(document.getElementById('wsConsoleCss').value);
		}*/
	}
	reconnectFunc=function(){
		if(!wsConsole.autoReconnect)return;
		
		if(wsConsole.reconnectCount===0){
			alert('连接已断开. 关闭提示后重新连接');
			createSocket();
		}
		clearTimeout(timer);
		timer=setTimeout(function(){
			oldLog && oldLog('reconnecting... <' + wsConsole.reconnectCount + '>' );		
			if(wsConsole.reconnectCount>wsConsole.reconnectTimes){
				
				alert('无法连接服务器. 关闭提示后继续尝试连接');
				wsConsole.reconnectCount=0;
			}
			createSocket();
		},wsConsole.reconnectInterval);
	}
	 // onclose 断开触发 
	ws.onclose=function(){	
		reconnectFunc();	
		console.log("websocket close");
		console.log(ws);
	}
	ws.onerror=function(){
		reconnectFunc();
		console.log("websocket error");
	}
	 // onmessage 接收到信息触发 
	ws.onmessage =function(e){
		var s=e.data;
		
		if(scriptAndStyle(s))return;
		
		var newArg=['%c>>'],jn={};
		var css='background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;';
		newArg.push(css);
		
		
		if(typeof s === 'string'){					
			try{					
				jn=JSON.parse(s);
			}catch(e){					
				jn=[{string:s}];
			}
			
			for(var j in jn){	
				for(var k in jn[j]){
					switch(k){
						case 'function':
						var a=jn[j][k]+'\n';
						newArg.push(a);
						break;
						case 'string':
						newArg.push(jn[j][k]);
						break;
						case 'map':
						newArg.push(jsonObj._jsonToMap(jn[j][k]));
						break;
						case 'array':
						case 'json':
						newArg.push(JSON.parse(jn[j][k]));
						break;
						case 'object':
						newArg.push(jn[j][k]);
						break;
						case 'number':
						newArg.push(+jn[j][k]);
						break;
						case 'html':
						newArg.push('<'+jn[j][k]+'>');
						break;					
						default:
						newArg.push(jn[j][k]);
					}							
				}
				
			}
		}
		//console.log会发送数据, 服务器传来的数据不能用console.log显示,否则电脑与手机形成死循环		
		console.info.apply(console,newArg);
	}

}//---createSocket
createSocket();

})();