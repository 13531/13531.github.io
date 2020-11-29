var kw={};
kw.a=["abstract","arguments","boolean","break","byte","case","catch","char","class","const","continue","debugger","default","delete","do","double","else","enum","eval","export","extends","false","final","finally","float","for","function","goto","if","implements","import","in","instanceof","int","interface","let","long","native","new","null","package","private","protected","public","return","short","static","super","switch","synchronized","this","throw","throws","transient","true","try","typeof","var","void","volatile","while","with","yield"];

kw.b=["Array","Date","eval","function","hasOwnProperty","Infinity","isFinite","isNaN","isPrototypeOf","length","Math","NaN","name","Number","Object","prototype","String","toString","undefined","valueOf"];

kw.c=["alert","all","anchor","anchors","area","assign","blur","button","checkbox","clearInterval","clearTimeout","clientInformation","close","closed","confirm","constructor","crypto","decodeURI","decodeURIComponent","defaultStatus","document","element","elements","embed","embeds","encodeURI","encodeURIComponent","escape","event","fileUpload","focus","form","forms","frame","innerHeight","innerWidth","layer","layers","link","location","mimeTypes","navigate","navigator","frames","frameRate","hidden","history","image","images","offscreenBuffering","open","opener","option","outerHeight","outerWidth","packages","pageXOffset","pageYOffset","parent","parseFloat","parseInt","password","pkcs11","plugin","prompt","propertyIsEnum","radio","reset","screenX","screenY","scroll","secure","select","self","setInterval","setTimeout","status","submit","taint","text","textarea","top","unescape","untaint","window"];
kw.d=["onblur","onclick","onerror","onfocus","onkeydown","onkeypress","onkeyup","onmouseover","onload","onmouseup","onmousedown","onsubmit"];

kw.e=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends"];

kw.f=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"];
kw.g=["arguments","this","super","console","window","document","localStorage","module","global"];

kw.h=["Intl","DataView","Number","Math","Date","String","RegExp","Object","Function","Boolean","Error","Symbol","Set","Map","WeakSet","WeakMap","Proxy","Reflect","JSON","Promise","Float64Array","Int16Array","Int32Array","Int8Array","Uint16Array","Uint32Array","Float32Array","Array","Uint8Array","Uint8ClampedArray","ArrayBuffer"];
kw.i=["EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"]
kw.j=["true","false","null","undefined","NaN","Infinity"];
var kwMap=new Map();


function addMap(arr,attr){
	for(var i in arr){
		 kwMap.set(arr[i],'<span class="'+attr+'">'+arr[i]+'</span>');
	}
	
} 
function getK_dot(k){
	return kwMap.has(k)?kwMap.get(k):'<span style="color:#a376f7">'+k+'</span>';
}
function getK_left(k){
	return kwMap.has(k)?kwMap.get(k):'<span class="sh_function">'+k+'</span>';
}
function getK(k){
	return kwMap.has(k)?kwMap.get(k):k;
}
var getKeyWord=function(k,k2,k3){
	
	//console.log(k,k2,k3);
	if(/\./.test(k)){
		var a=k.split('.');
	return 	k.replace(/\.(.+$)/,'.<span c="color:#a376f7">$1</span>')+k2;
	}else {
		if(/(^§?\()/.test(k2)){
			return getK_left(k)+k2
		}else{
			return getK(k)+k2;
		}
	}
}
addMap(kw.a,'sh_keyword');
addMap(kw.b,'sh_keyword');
addMap(kw.c,'sh_keyword');
addMap(kw.d,'sh_keyword');
addMap(kw.e,'sh_keyword');
addMap(kw.f,'sh_keyword');
addMap(kw.g,'sh_keyword');
addMap(kw.h,'sh_predef_func');
addMap(kw.i,'sh_keyword');
addMap(kw.j,'sh_predef_var');
function sh_konquerorExec(s) {
  var result = [''];
  result.index = s.length;
  result.input = s;
  return result;
}
function testMYHL(text){
	
	console.time('aaaa');
	var language=sh_languages['javascript_test_1'];
	var reArr=[];
	/*for (var s = 0; s < language.length; s++) {
        for (var p = 0; p < language[s].length; p++) {
          var r = language[s][p][0];
		  var rep=language[s][p][1]
          if (r.source === '$') {
            r.exec = sh_konquerorExec;
          }
		
		
		  reArr.push([r,function(p){
			  return '<span class="'+ rep+'">'+p+'</span>'
		  }]);
        }
      }*/
	 for(var i in language){
		 var re=language[i][0];
		 var classname=language[i][1];
		  (function(r,x){
		
		
		 reArr.push([r,function(p){
			  return '<span class="'+x+'">'+p+'</span>'
		  }])
		 })(re,classname)
	 }
	 console.log(reArr)
	var res=branchReplace(text,reArr);	
	console.timeEnd('aaaa');
	return res;
}

function hightlight(o){
	//o.style.display='none';
	console.time('my_hljs')
	var code=o.innerHTML;
	var orginalCode=code;
	o.innerHTML='';
	//.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/^\n|^\r/,"");=
	//o.innerHTML=code.innerHTML.replace(/^\n|^\r/,"");
	
	var textValue={};
	var replaceValue={};
	var mark="𪚥";
	var idNum=0;
	var timer;
	var lineNum=0;
	var _arr=[];	
	var arr=[];
	var count=0;
	var resHtml='';
	var saveReplace=function(p,val){		
		id=mark+idNum++ +'§';
		replaceValue[id]=val;
		textValue[id]=p;
		return id;
	}
	var restore=function(p){
		var res=replaceValue[p];
		if(/𪚥\d+§/.test(res)){
			res=restore(res);
		}
		return res;
	}
	var textRestore=function(p){
	
		return p.replace(/𪚥\d+§/g,function(x){	
			
				return textValue[x];
			})
	}
	var addLineNum=function(val){		
		return val.replace(/\n/g,function(p){
			lineNum++;
			return p+'<input type="button" value="'+lineNum+'" />';
		});
	}
	//区块注释
	//code=code.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g,function(p){
	code=code.replace(/(\s*)?\/\*[\s\S]*?\*\//g,function(p){
		//replace(/(@[\w\d]+)/g 参数说明
		p=p.replace(/(@[\w\d]+)/g,'<strong class="sh_type">$1</strong>');
		return saveReplace(p,'<span class="sh_comment">'+p+'</span>');	
	});
	 _arr=code.split(/\n/);	

	for(var i=0,step=9999,index,lng=_arr.length;i<lng;i+=step){
		arr[count]=[];
		for(var j=0;j<step;j++){
			index=i+j
			if(index<lng){
			arr[count].push(_arr[index]);
			}else{
			break;
			}
		}
		arr[count]=arr[count].join('\n')+'\n';		
		count++
	}
	
	var timerEach=function(arr,n,len,func){	
		
			
		arr[n]=arr[n]		
		.replace(/"(\\"|.?)+?"/g,function(p){
			//双引号
			return saveReplace(p,'<span class="sh_string">'+p+'</span>');
		})
		.replace(/'(\\'|.?)+?'/g,function(p){
			//单引号
			return saveReplace(p,'<span class="sh_string">'+p+'</span>');
		})		
		.replace(/(^|[^"'\\:])\/\/.+[\n|\r]/gm,function(p,p1,p2){		
		//.replace(/\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg,function(p,p1,p2){
			//单行注释	
			//  /^\.\//,<br>  http://123  <br> "123//123" <br>'123//123' <br>
			//恢复引号
			return saveReplace(p,'<span  class="sh_comment">'+textRestore(p)+'</span>');	
			
		})	
		.replace(/\/(\\\/|.)+\/[img]*/g,function(p){
		//.replace(/\/(?:\\.|[^*\\\/])(?:\\.|[^\\\/])+\//g,function(p){//问题			
			return saveReplace(p,'<span class="sh_regexp">'+textRestore(p)+'</span>');	
		})
		.replace(/([\|\=\!&\+\-\*\/\s])(\d+(\.\d+)?)/g,function(p,p1,p2){			
			return saveReplace(p,p1+'<span class="sh_number">'+p2+'</span>')
		}).replace(/([[\|\=\!&\+\-\*\/\s])(\d+(\.\d+)?)([[\|\=\!&\+\-\*\/\s])/g,function(p,p1,p2,p3){
			return saveReplace(p,p1+'<span class="sh_number">'+p2+'</span>'+p3);
		})
		.replace(/\b(?:abstract|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|final|finally|for|function|goto|if|implements|in|instanceof|interface|native|new|null|private|protected|prototype|public|return|static|super|switch|synchronized|throw|throws|this|transient|true|try|typeof|var|volatile|while|with)\b/g,function(p){
			return saveReplace(p,'<span class="sh_keyword">'+p+'</span>');	
		})
		.replace(/\b(?:Array|Boolean|Date|Error|EvalError|Function|Number|Object|RangeError|ReferenceError|RegExp|String|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt)\b/g,
      function(p){
			return saveReplace(p,'<span class="sh_predef_func">'+p+'</span>');	
		})
		.replace(/([a-z$_\d]+?)(\s+)?(\()/ig,function(p,p1,p2){
			return saveReplace(p,'<span class="sh_function">'+p1+(p2||'')+'</span>')+'(';	
		})
		.replace(/(\.)([a-z$_\d]+)/ig,function(p,p1,p2){
			return p1+saveReplace(p,'<span style="color:#c269f4">'+p2+'</span>');	
		})
		 .replace(/\b(?:Math|Infinity|NaN|undefined|arguments)\b/g,
		 function(p){
      
	  return saveReplace(p,'<span class="sh_predef_var">'+p+'</span>');
		 })
		//.replace(/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g
		
	.replace(/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|\.|\/|\?|\||;|<|>|,|:|&amp;|&lt;|&gt;/g //|&|:|
      ,function(p){
			return saveReplace(p,'<span class="sh_symbol">'+p+'</span>');	
		})
		.replace(/\{/g,
		function(p){
		  
			return saveReplace(p,'<span class="cbracket_ctn"><span class="sh_cbracket">{</span>');	
		})
		.replace(/\}/g,
		function(p){
		  
		return saveReplace(p,'<span class="sh_cbracket ">}</span></span>');	
		})
		/*.replace(/\{|\}/g,
		function(p){
		  
			return saveReplace(p,'<span class="sh_cbracket">'+p+'</span>');	
		})*/
		.replace(/𪚥\d+§/gm,function(p){						
			
			return restore(p);
		})
	
		//if(n===0){	
			//预先显示部分代码	
			/*_(o).ap('<]>',_('<span>'+addLineNum(arr[n]+'</span>'))).show();
			arr[n]='';			*/
		//}else{
		//	
		//	
		//}
		//_(o).ap('<]>',_('<div class="code-part">'+addLineNum('\n'+arr[n])+'</div>')).show()
		//arr[n]=addLineNum(arr[n]);
		
		
		resHtml+=addLineNum(arr[n]);
		//resHtml+=arr[n];
		if(timer)clearTimeout(timer);				
		timer=setTimeout(function(){
			document.title=n+'_'+len;			
			if(n<len)timerEach(arr,++n,len,func);
			else {				
				func();	
				textValue=null;
				replaceValue=null;
				resHtml=null;
			}
		},1);
	}//--timerEach
		
	
				
	timerEach(arr,0,arr.length-1,
	function(){	
		console.log(resHtml.length);
		_(o).html(resHtml).show();
		console.log('长度',o.textContent.length,orginalCode.length);
		//o.innerHTML=resHtml;
		console.timeEnd('my_hljs');
		_(o).on('mouseover',{'class':'sh_cbracket'},function(e){
				var n=_(e.target);
				var p=_(e.target).parent();
				n.once('mouseout',function(){
				_(p.node.firstChild).css({'background':''});
				_(p.node.lastChild).css({'background':''});
				}).parent();
				_(p.node.firstChild).css({'background':'darkgreen'});
				_(p.node.lastChild).css({'background':'darkgreen'});
			})
		
		
		
		
			
		}
	);		
	
}
