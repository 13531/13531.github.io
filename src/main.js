(function(){
'use strict';
marked.setOptions({
  // 他是底层的东西，一般不改，比如 **我是粗体** 解析成<strong>我是粗体</strong>，如果你不满意就可以改变他的结构，比较麻烦。
  renderer: new marked.Renderer(), 	
	// 默认：true， 启用Github的风格
  gfm: true,	
	// 默认：true，启动表格， 前提必须gfm: true,
  tables: true,	
	// 默认：false，启用回车换行，前提必须gfm: true,
  breaks: false,	
	// 默认：false，尽可能地兼容 markdown.pl的晦涩部分。不纠正原始模型任何的不良行为和错误。
  pedantic: false,	
	// 默认：false，对输出进行过滤（清理），将忽略任何已经输入的html代码（标签）
  sanitize: false,	
	// 默认：true，使用比原生markdown更时髦的列表。 旧的列表将可能被作为pedantic的处理内容过滤掉
  smartLists: true,	
	// 默认：false，使用更为时髦的标点，比如在引用语法中加入破折号。
  smartypants: false
  
  
});

String.prototype.urlEncode=function(){	
	return this.replace(/[^\/]/g,function(p){
			
			/*	if(/\p{Unified_Ideograph}/u.test(p)){
					console.log(p);
					return p;
				}*/
				return encodeURIComponent(p);
			});
}
var nameToPid={};
var pidToName={};
var nameToUrl={};
var pidToUrl={};
var dataJn={};
function loadPid(pid){
	
	//nameToPid 依赖articles-list.js
	if(nameToPid[pid])pid=nameToPid[pid];

	if(dataJn[pid]){
	//依赖  articles-list.js
		loadContent('./articles'+pidToUrl[pid].urlEncode(),dataJn[pid]);
	
	}else{
	//不需要articles-list.js
	_.get( './articles/pid/'+pid+'.pid.json?t='+Math.random(),function(r){
		
		if(r.url){
			var url=r.url.urlEncode();
		
			loadContent('./'+url,r);
		}else{
			_('#contentCtn').html('<h4>该文章不存在</h4>');
		}
	},null,
	function(){
		_('#contentCtn').html('<h4>该文章不存在</h4>');
	});
	}
	
}
function loadContent(url,_r){	

	_.get( url+'?t=a'+Math.random(),function(r){	
	
		var f=_r.url.split('/');	
		var t=f[f.length-2].replace(/\.title.*?$/,'').replace(/^\d+@/,'').replace(/^\{\{.*?\}\}/,'');
		var title='<h2>'+t+'</h2><hr>';
		document.title=t;
		r=r.replace(/(<code[^>]*>)([\s\S]*?)(<\/code>)/ig,function(p,p1,p2,p3){	
				return p1+p2.replace(/</g,"&lt;").replace(/>/g,"&gt;")+p3;
			});
		
		r=title+marked(r)+ '<hr><small>文档创建: '+fillZero(_r.createtime)+'<br />最后编辑: '+fillZero(_r.updatetime)+'</small>';	
		
		var hasCode=false;
		var scriptArr=[];
		var contentCtn=_('#contentCtn').html(r)._qAll('link').each(function(o){
			_(o).attr({'href':_(o).attr('href').urlEncode()});
			//修改href链接
			if(o.href.length==0)return;
			var s=o.href.split('/');
			f[f.length-1]=s[s.length-1];			
			o.href=f.join('/');
			_(o).ap(_('head'),'<]>').attr({'rel':'stylesheet'})			
		})._qAll('img,audio,video,script').each(function(o){
			_(o).attr({'src':_(o).attr('src').urlEncode()});
		//修改src链接
			if(o.src.length==0)return;
			var s=o.src.split('/');
			f[f.length-1]=s[s.length-1];			
			o.src=f.join('/');
			
		})._qAll('script').each(function(o){
			var src=_(o).attr('src').urlEncode();
			var nocache=o.getAttribute('nocache');
				if(nocache==='true'||nocache===true){
					src=src+'?t='+Math.random();
				
				}
			_(o).attr({'src':src});
			scriptArr.push(src);
		//使script 生效		
			//_(o.outerHTML).ap(_('body'),'<]>')
			
			
		})._qAll('.code').each(function(o){
			hasCode=true;
			_(o).addClass('sh_sourcecode').vHide();					
					
		});
		
		_.loadJsArr(scriptArr,function(){});
		
		if(hasCode){
			/*contentCtn._qAll('code').each(function(o){
					//hightlight(o);
					var str=o.innerHTML;
					//str=sh_highlightString(str,'javascript');
					o.innerHTML=str;
					_(o).vShow();
					//sh_highlightDocument();
					//sh_highlightElement(o, 'javascript');
				});*/
		_.loadCss('./src/myhl_javascript.css',function(){
			
			_.loadJsArr(['./src/myhightlight.js'],function(){
				
					contentCtn._qAll('.code').each(function(o){
			o.innerHTML=o.innerHTML.replace(/</g,"&lt;").replace(/>/g,"&gt;");
						hightlight(o);
						
					});
				});	
		});			
			
		}		
	}	);
		
}
function fillZero(t){	
	return t.replace(/\d+/g,function(p){			
			if(p.length==1)return '0'+p;
			else return p
		});
}
function getMenu(arr,n,menu){
	if(!menu[arr[n]]){
		menu[arr[n]]={};		
	}
	if(arr[n+1])getMenu(arr,n+1,menu[arr[n]]);
}
function showList(e){	
	var arr=e.split('|');
	e.replace(/{\{(.*?)\}}.*?\|(\d+)\|/g,function(p,p1,p2){
		nameToPid[p1]=p2;
		pidToName[p2]=p1;
	});
	
	var posts=[];
	for(var i=0,lng=arr.length-1;i<lng;i+=4){
		var t=arr[i+2];
		t=fillZero(t);
		pidToUrl[arr[i+1]]=arr[i];
		//console.log(t);
		dataJn[arr[i+1]]={ 
		updatetime:arr[i+2],
		createtime:arr[i+3],
		url:'./articles'+arr[i]
		}
		posts.push({url:arr[i],pid:arr[i+1],_updatetime:+t.match(/\d+/g).join(''),updatetime:t})	
	}
	function compare(p){
		return function(m,n){  
			return n[p] - m[p]; 
		}
	}
	//按更新时间排序
	posts.sort(compare('_updatetime'));
	//console.log(posts)
	
	function fillZeroMark(f){		
		return f.replace(/(^\d+)@/,function(p1,p){
			var x=p;
			p=10000000+ +p;
			p=String(p).replace(/^1/,'0');
			return '<!--'+p+'@-->' ;
		});	
		
	}
	
	var htmlArr=[],postTitle='',url;
	var menuJn={};
	var recentNum=0;
	var showall=_.localGet('showall');
	
	for(var i=0,lng=posts.length;i<lng;i++){
		//要到 数字.json 文件转义网址
		/*posts[i].url=posts[i].url.replace(/#/g,function(p){
			return encodeURIComponent(p);
		})*/
		 postTitle=posts[i].url.split('/');
		 //for(var p in postTitle){
			 // postTitle[p]=encodeURIComponent(postTitle[p]);
		// }
		// posts[i].url=postTitle.join('/');
		
		 //if( postTitle.length===1)continue;
		if(showall!=='y'&&/\{hide\}/.test(posts[i].url))continue;
		 var tit=postTitle[postTitle.length-2].replace(/\.title$/ig,'');
		var pid=posts[i].pid;
		if(pidToName[pid])pid=pidToName[pid];
		
		 var aLink='<a href="./?p='+pid+'" title="'+posts[i].updatetime+'" data-pid="'+posts[i].pid+'" data-url="'+posts[i].url+'">'+tit.replace(/^\d+@/,'').replace(/^\{\{.*?\}\}/,'')+'</a>'
		// htmlArr.push('<li class="">'+aLink+'</li>');
	
		if(recentNum++<30)getMenu(['最近更新','<!--'+(100000+i)+'排序--><small>'+posts[i].updatetime.split(' ')[0]+'</small> '+aLink],0,menuJn);
		//分割链接 组成分类
		var p=posts[i].url.split('/');
	
		//用于排序
		p[p.length-2]=(tit.match(/^\d+@/)||[''])[0]+'<!--'+(100000+i)+'排序-->'+aLink;//fillZeroMark((tit.match(/^\d+@/)||[''])[0]+aLink);
		
		for(var k in p){			
			p[k]=fillZeroMark(p[k]);
		}
		//删除数组最后一个元素
		p.length--;
		//生成json树结构 保存到menuJn
		getMenu(p,1,menuJn);
		
	}
	var arrTree=[];
	var menuHtml=[];
	
	//json按key键排序
	function jsonSort(jsonObj,num) {
		let arr = [];
		for (var key in jsonObj) {
			arr.push(key)
		}
		arr.sort();	
		//console.log('同级:',arr);
		for (var i in arr) {
			//console.log( 'key--->',arr[i] )
			var k=arr[i];
			if(/\.title/.test(k)){				
				menuHtml.push('<div class="posts-link">'+k+'</div>');				
				continue;
			}
			menuHtml.push('<div class="menu-'+num+'"><div class="menu-item" data-menu-id="'+num+'">'+k+'</div><div  class="menu-child menu-child-'+num+'">')
			if(!/\.title$/.test(k)&& JSON.stringify(jsonObj[arr[i]]) !== '{}'){
				(function(x){
					x++;			
					jsonSort(jsonObj[arr[i]],x);				
				})(num)				
			}
			menuHtml.push('</div></div>');
		}
		
	}
	jsonSort(menuJn,1);	
	_('#menuContainer').html(menuHtml.join(''));
	
	var pid=_.localGet('p');
	if(pid){
		loadPid(pid);	
		_('#menuContainer').hide();
	
		
		_('#menu').on('click.a',{'id':'menuBtn'},function(){
	
			_('#menuContainer').changeDisplay();
		});
	}else{
		document.title='welcome!';
		//_('#menuContainer').show();
	
	//展开导航列表与最近更新列表
 	var c=_('.menu-child-1');		
	_(c.nodes[0]).show();
	_(c.nodes[c.nodes.length-1]).show();

	}
	_('#unfold').show();
	_('#fold').hide();
}
showList(articles_list);

_('#menu').on('click',{'data-menu-id':null},function(e){
	var t=_(e.target);
	var c='.menu-child-'+t.attr('data-menu-id');
	
	t.parent().qAll(c).changeDisplay();
});
_('#unfold').on('click',function(){
	_('.menu-child').show();
	_('#unfold').changeDisplay();
	_('#fold').changeDisplay();
});
_('#fold').on('click',function(){
	_('#unfold').changeDisplay();
	_('#fold').changeDisplay();
	_('#menuContainer').qAll('.menu-child').hide();
});

var debug=_.localGet('debug');

if(debug==='1'){
	_.loadJsArr(['./src/mjs/web-console.js'],
	function(){
		console.log('wsConsole.js');
		
	}
	);
}

})();