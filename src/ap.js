'use strict';

var aim = {
	'[<>':function (tgElement, newElement)  {

		var pElement = tgElement.parentNode;
		if (tgElement.firstChild) {
			pElement.insertBefore(newElement, pElement.firstChild);
		} else {
			pElement.insertBefore(newElement, tgElement);
		}
		return newElement;
	},
	']<>':function (tgElement, newElement) {
		var pElement = tgElement.parentNode;
		pElement.insertBefore(newElement, tgElement);
		return newElement;
	},
	'<[>': function(tgElement, newElement) {
		if (tgElement.firstChild) {
			tgElement.insertBefore(newElement, tgElement.firstChild);
		} else {
			tgElement.appendChild(newElement);
		}
		return newElement;
	},
	'<]>': function(tgElement, newElement) {
		tgElement.appendChild(newElement);
		return newElement;
	},
	'<>[':function(tgElement, newElement) {
		var pElement = tgElement.parentNode;
		if (pElement.lastChild == tgElement) {
			pElement.appendChild(newElement);
		} else {
			pElement.insertBefore(newElement, tgElement.nextSibling);
		}
		return newElement;
	},
	'<>]':function (tgElement, newElement) {
		tgElement.parentNode.appendChild(newElement);
		return newElement;
	}
}

var xx =window._= function (selector) {
    return (new xx.prototype.init(selector));
}

xx._removeEvent = function (ts, type, handler, capture,isOne) {
    if (ts.nodes) {		
        for (var i = 0, lng = ts.nodes.length; i < lng; i++) {
            ts.nodes[i].removeEventListener(type, handler, capture);
			
        }
    } else{    
		ts.node.removeEventListener(type, handler, capture);
	}

}
var oneFunc=function(node,type, handler, capture){
	var removeFn=function(){
				node.removeEventListener(type, handler, capture);
				node.removeEventListener(type, removeFn, capture);
			}
	node.addEventListener(type, removeFn, capture);
}		
xx._addEvent = function (ts, type, handler, capture,isOne) {
    if (ts.nodes) {
        for (var i = 0, lng = ts.nodes.length; i < lng; i++) {
            ts.nodes[i].addEventListener(type, handler, capture);
			if(isOne=='one'){
				oneFunc(ts.nodes[i],type, handler, capture);
			}
        }
    } else{
        ts.node.addEventListener(type, handler, capture);
		if(isOne==='one'){
			oneFunc(ts.node,type, handler, capture);
		}
	}
}
xx.throwError=function(str){
	try {
		throw new Error(str);
	} catch (e) {	
		console.log(e);     // 'MyError'
		//console.log(e.message);  // 'custom message'
		
	}
}
xx.findPos=function(obj) {
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent) {		
	do {
	curleft += obj.offsetLeft;
	curtop += obj.offsetTop;
	} while (obj = obj.offsetParent);
	}else{
		curleft = obj.offsetLeft;
		curtop = obj.offsetTop;
	}	
	return({
	'x': curleft,
	'y': curtop
	});
}

//苹果手机 url只能用相对地址
xx.get=function(url, _callback,data){
	xx.ajax({
     url:url,
     type:'get',
     data:data,
	callback:_callback
	});
}

//苹果手机 url只能用相对地址
xx.post=function(url, data, _callback,_error){	
	xx.ajax({
     url:url,
     type:'post',
     data:data,
	 error:_error||function(e){},
	callback:_callback});
}

/*ajax封装
       @param option:传入一个对象
       url:请求的路径
       type:请求的不同类型get或post
       data:发送的数据,格式:{key1:value1,key2:value2}
       callback:回调函数,方便用户处理自己的数据,传递逻辑           
*/
function params(json){
  let paramArr = []
  for (let p in json) {
    paramArr.push(p + '=' +  encodeURIComponent(json[p]));
  }
  return paramArr.join('&')
}
xx.ajax=function(option){	
       //创建异步对象
       var xhr  = new XMLHttpRequest();	 
       //如果是get并且有数据
       if(option.type=='get'&&option.data){
            option.url=option.url+'?'+params(option.data);
       }
       //设置请求行
       xhr.open(option.type,option.url);
       //设置请求头(post有数据发送才需要设置请求头)
       //判断是否有数据发送
       if(option.type=='post'&&option.data){
             xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
       }
	   xhr.onerror=option.error;
	   
       //注册回调函数
       xhr.onreadystatechange = function(){
             if(xhr.readyState==4&&xhr.status==200){
				 
                 //接收返回的数据类型
                 var type = xhr.getResponseHeader('Content-Type');
                 //json格式
                 if(type.indexOf('json')!=-1){	
			// console.log(JSON.parse(xhr.responseText))
					var jn;
					try{	
						jn=JSON.parse(xhr.responseText)
                      
					}catch(e){
						console.log('JSON格式错误:',xhr.responseText);
						jn=xhr.responseText;
					}
					  option.callback(jn);
                 }
                 //xml格式
                 else if(type.indexOf('xml')!=-1){
                      option.callback(xhr.responseXML);
                 }
                 //普通格式
                 else{
					 
                      option.callback(xhr.responseText);
					 
                 }
             }
			 
			   
       }
       //发送请求主体
       //判断不同的请求类型     
	  xhr.send(option.type=='post'?params(option.data):null);
}
xx.setValue=function(key,value){
	//window.sessionStorage.setItem(key,value); 只在同一标签生效
	window.localStorage.setItem(key,value);
}
xx.getValue=function(key){
	// return window.sessionStorage.getItem(key);
	return window.localStorage.getItem(key);
}
//获取网址参数
xx.localGet=function(variable){
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
		   var pair = vars[i].split("=");
		   if(pair[0] == variable){return pair[1];}
   }
   return(false);
}



//附加功能
xx.prototype = {
	/*eventNamespace:new Map,*/
	eventCount:0,
	events:{},
    init: function (f) {
		this.eventNamespace=new Map;
		this.eventNamespace.set('test_init',1);
        this.selector = f;
		this.events={};
		//this.off=function(){};
		this.offEvents={};
        if (typeof f === 'string') {
            switch (f.charAt(0)) {
            case '<':
                this.node = new DOMParser()
                    .parseFromString(f, 'text/html')
                    .querySelector('body *');
                break;
            default:
                var r = document.querySelectorAll(f);
                this.node = r[0];
                this.nodes = r;
            }
        } else if (typeof f === 'object') {
            this.node = f;
        }
        return this;
    },
    ap: function () {
        if (typeof arguments[0] === 'object') {
            aim[arguments[1]](arguments[0].node || arguments[0], this.node);
        } else {
            for (var i = 1, lng = arguments.length; i < lng; i++) {
                if (typeof arguments[i] === 'string') {
                    aim[arguments[0]](this.node, document.createTextNode(arguments[i]));
                } else {
                    aim[arguments[0]](this.node, arguments[i].node || arguments[i]);
                }
            }
        }
        return this;
    },
    html: function (d, fn) {
        if (typeof d!=='undefined' && typeof fn==='undefined') {
            this.node.innerHTML = d;
            return this;
        } else if (d == 'set' && typeof fn === 'function') {
            this.node.innerHTML = fn(this.node.innerHTML);
            return this;
        } else if (d == 'get' && typeof fn === 'function') {
            return d(this.node.innerHTML);
        } else
            return this.node.innerHTML;

    },

    text: function (d) {
        this.each(function (o) {
            o.textContent = d;
        });
        return this;
    },
    val: function (d, fn) {		
        if (typeof d !=='undefined' &&typeof fn=='undefined') {	
            this.node.value = d;
            return this;
        } else if (typeof d==='undefined'){
			 return this.node.value;
			
		}else if (d == 'set' && typeof fn === 'function') {
            this.node.value = fn(this.node.value);
            return this;
        } else if (d == 'get' && typeof fn === 'function') {
            return fn(this.node.value);
        } 

    },
    remove: function (time, fn) {
        var ts = this;
        if (time) {
            if (fn)
                fn(this);
            setTimeout(function () {
                xx._each(ts, function (o) {
                    o.parentNode.removeChild(o);
                    console.log(o);
                    ts = null;
                });
            }, time);
        } else {
            xx._each(this, function (o) {
                o.parentNode.removeChild(o);
            });
        }
        return this;
    },
    hide: function (time, fn) {
        var ts = this;
        if (time) {
            

            var timer = setTimeout(function () {
                ts.each(function (o) {
					
                    o.style.display = 'none';
					if (typeof fn==='function') fn(ts);
                    ts = null;
                    clearTimeout(timer);
                });
            }, time);
			
               
        } else {
            this.each(function (o) {
                o.style.display = 'none';
            });
        }
        return this;

    },
    show: function () {
        this.each(function (o) {
            o.style.display = 'block';
        });
		return this;
    },
    attr: function (d,f) {
        if (typeof d === 'string'&&!f) {
            
            return this.node.getAttribute(d);
        } else if (typeof d === 'object') {
            for (var i in d) {
              //  console.log(d);
                this.node.setAttribute(i, d[i]);
            }
            return this;
        }else if(d&&f) {
			this.node.setAttribute(d, f);
			return this;
		}
    },
    css: function (a, b) {
        if (typeof a === 'object') {            
			this.each(function (o) {
				for (var i in a) {
					o.style[i] = a[i]
				}
			});
            
        } else {
            this.each(function (o) {
                o.style[a] = b;
            });
        }
        return this;
    }
	,hasClass:function(a){	
		var r=a.split(/\s+/g);
		var c=this.node.className.split(/\s+/g);
		for(var j in r){
			if(c.indexOf(r[j])==-1){
				return false;
			}			
		}
		return true;
	}
	,isClass:function(a){
		if(this.node.className===a) {
			return true;
		}else{
			return false;
		}
		
	}
	,addClass:function(a){
		this.each(function(node){			
			var r=a.trim().split(/\s+/g);			
			var c=node.className.split(/\s+/g);
			if(node.className.length==0)c=[];
			for(var j in r){
				if(c.indexOf(r[j])==-1){
					c.push(r[j]);
				}
			}
			node.className=c.join(' ').trim();
		});
		return this;
	}
	,removeClass:function(a){
		this.each(function(node){
			var r=a.split(/\s+/g);
			var c=node.className.split(/\s+/g);
			for(var j in r){
				var index=c.indexOf(r[j]);
				if(index>-1){
					c.splice(index, 1);
				}
			}
			node.className=c.join(' ');
		});
		return this;
	}
	,each: function (fn) {
        if (this.nodes) {
            for (var i = 0, lng = this.nodes.length; i < lng; i++) {
                fn(this.nodes[i]);
            }
        } else{
            fn(this.node);
		}
        return this;
    }
	,one:function(type,handler){
		 xx._addEvent(this, type,handler,false,'one');
	}
	/*
	 解除绑定click  
	 
	 off('.aa')解除 click.aa.bb.cc mouse.aa.bb.cc
	  off('click.aa')解除 click.aa及子命名
	 off('click')解除 所有click
	*/
	
	,off:function(type){
		//this.offEvents&&this.offEvents[type]&&this.offEvents[type]();
		
		//根据子命名解除绑定
		if(type.indexOf('.')===0){
			for(var i in this.offEvents){
				if((i+'.').indexOf((type+'.'))>0){
					console.log('off:清除',type,'命名的',i);
					this.offEvents[type]();
				}	
			}	
		}else {
		//根据绑定事件解除绑定
			for(var i in this.offEvents){
				if((i+'.').indexOf((type+'.'))===0){
				console.log('清除:',i);
				this.offEvents[type]();
				}
			}
		}
				
		
		return this;
	}
	/*
		
	*/
	,exeOn:function(type){			
		var handler=this.events[type];	
		console.log('模拟:',type,'-->',handler);
		if(!handler){				
			return this;
		}		
		//HTMLEvents MouseEvent UIEvent
		var ev = document.createEvent('MouseEvent');	
		handler.call(this.node,ev);
		return this;		
	}
		
    /*
    @ev click mouseup keyup.....
    @arg {string}:选择tag ; {json} 例如{id:null} 选择含有id 子节点生效; {id:'abc'} 具体的id生效
    @fn {funtion}
     */
	 ,on:function(type, arg, handler){
		 this.each(function(o){
			 xx(o)._on(type, arg, handler);
		 });
		 return this;
	 }
	,_on: function (type, arg, handler) { 
		console.log('events',this.events);
		if(this.events[type]){
			throw new Error(type+' 重复绑定. 需解除绑定或使用命名空间避,如'+type+'.name');
		}
		var _type=type.split('.')[0];
		var func;
		if(typeof arg==='function'){
			func=arg;
		}else{
			func=function (e) {			
				if (typeof arg === 'string' &&e.target.tagName == arg.toUpperCase()) {
				   handler(e);
				} else if (typeof arg === 'object') {
					var tg = e.target;
					for (var i in arg) {
						var val = tg.getAttribute(i);
						if (val) {
							if (val == arg[i] || arg[i] === null){
								handler(e);
								 break;
							}
							if(i=='class'&&xx(tg).hasClass(arg[i])){
								handler(e);
								 break;
							}
						   
						}

					}

				}
			}
		}
		var ts=this;
		this.node.addEventListener(_type,func,false);
		this.events[type]=func;
		this.offEvents[type]=function(){
			ts.node.removeEventListener(_type,func);
			delete ts.offEvents[type];
			delete ts.events[type];
			ts=null;
		}
		return this;
    }
	,findPos:function(){
		return xx.findPos(this.node);
	}
	,setPos:function(x,y){
		this.each(function(o){
			o.style.left=x+'px';
			o.style.top=y+'px';
		});
		return this;
	}
	,focus:function(){		
		this.node.focus();
		return this;		
	}
	,blur:function(){
		this.node.blur();
		return this;
	}
	,find:function(d){
		this.nodes=this.node.querySelectorAll(d);
		this.node=this.nodes[0];
		return this;
	}
	,qAll:function(d){
		this.nodes=this.node.querySelectorAll(d);
		this.node=this.nodes[0];
		return this;
	}
	,parent:function(){
		this.node=this.node.parentNode;
		return this;
	}
}

//遍历document的on开头的属性
/*
for (var i in document) {
    console.log(i);
    if (/^on/.test(i)){
		
	}
		
}*/
xx.fn={
	extend:function(obj){
		for(var i in obj){
			if(xx.prototype[i]){
				throw new Error('重名'+i);
			}
			xx.prototype[i]=obj[i];
		}	
	}
}
xx.extend=function(obj){
	for(var i in obj){
		if(xx[i]){
			throw new Error('重名'+i);
		}
		xx[i]=obj[i];
	}	
}

console.info('ap.js');
xx.prototype.init.prototype = xx.prototype;

//export default xx;
//})();
