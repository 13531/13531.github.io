function hightlight(o,noLineNumber){
	//o.style.display='none';
	//console.time('my_hljs')
	var code=o.innerHTML;
	var orginalCode=code;
	
	code=code.replace(/</g,"&lt;").replace(/>/g,"&gt;");
	//o.innerHTML='';
	//.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/^\n|^\r/,"");=
	//o.innerHTML=code.innerHTML.replace(/^\n|^\r/,"");
	//var title=document.title;
	var textValue={};
	var replaceValue={};
	var mark="𪚥";
	var idNum=1;
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
		while(/𪚥\d+§/.test(res)){
			console.log(res);
			res=res.replace(/𪚥\d+§/g,function(g){						
			
				return restore(g);
			});		
		}
		
		return res;
	}
	var textRestore=function(p){
	
		return p.replace(/𪚥\d+§/g,function(x){	
			
				return textValue[x];
			})
	}
	var addLineNum=function(val){		
		return val.replace(/.*?\n/g,function(p){
			lineNum++;
			if(noLineNumber)return '<ul class="code-line" id="line-'+lineNum+'" />'+p+'</ul>';
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
		
			
		arr[n]=arr[n].replace(/<br><\/div>|<br>|<\/div>/igm,'\n')	
	.replace(/<div>|<\/div>|<br>|<br \/>|<br\/>/igm ,function(p){
		return saveReplace(p,p);	
	})		//bug:'"'"'
		.replace(/"(\\"|.?)+?"/g,function(p){
			//双引号
			
			return saveReplace(p,'<span class="sh_string">'+p+'</span>');
		})
		.replace(/'(\\'|.?)+?'/g,function(p){
			//单引号
			
			return saveReplace(p,'<span class="sh_string">'+p+'</span>');
		})		
		//.replace(/(^|[^"'\\:])\/\/.+(\n|\r)/gm,function(p,p1,p2){		
		//.replace(/\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.+(\n|\r)/mg,function(p,p1,p2){//问题
			//单行注释	
			//  /^\.\//,<br>  http://123  <br> "123//123" <br>'123//123' <br>
			//恢复引号
			//console.log(p);
			//return saveReplace(p,textRestore(p));
		//	return saveReplace(p,'<span  class="sh_comment">'+textRestore(p)+'</span>');	
			
		//})	
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
	
	.replace(/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|\.|\/|\?|\||;|,|:|&amp;|&lt;|&gt;/g //|&|:|  |&lt;|&gt;|<|>
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
		//console.log(resHtml.length);
		if(noLineNumber)_(o).html(resHtml.replace(/\>$/,'style="display:none" >')).vShow();
		else _(o).html(resHtml.replace(/\>$/,'style="display:none" >')+'<button class="copy" >复制</button>').vShow();
		//console.log('长度',o.textContent.length,orginalCode.length);
		//o.innerHTML=resHtml;
	//	console.timeEnd('my_hljs');
		/*_(o).on('mouseover',{'class':'sh_cbracket'},function(e){
				var n=_(e.target);
				var p=_(e.target).parent();
				n.once('mouseout',function(){
				_(p.node.firstChild).css({'background':''});
				_(p.node.lastChild).css({'background':''});
				}).parent();
				_(p.node.firstChild).css({'background':'darkgreen'});
				_(p.node.lastChild).css({'background':'darkgreen'});
			})
			.on('click',{'class':'copy'},function(){
				var t=orginalCode.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
				_.execCopy(t);
			
			});*/
		
		
		
		
		//	document.title=title;
		}
	);		
	
}
