
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




_('.page-hide').removeClass('page-hide');
var logo=_('.logo').node,timer;
var count=0;
var logoAnim=function(node){	
	timer=setTimeout(function(){		
		if(node.offsetWidth>130){			
			var w=node.offsetWidth*0.9,
			h=node.offsetHeight*0.9;			
			node.style.width=w+'px';
			node.style.height=h+'px';
			logoAnim(node)
		}else if(node.offsetWidth<=130){
			count+=50
		node.style.marginRight=count+'px';
		if(count<document.body.offsetWidth-0)
			logoAnim(node)
			
		}
	},10);
}


function loadPid(pid){
	_.get( './articles/pid/'+pid+'.pid.json?t='+Math.random(),function(r){
	loadContent('./'+r.url,r);
	});
	
}
function loadContent(url,_r){

	
	_.get( url+'?t=a'+Math.random(),function(r){				
	
		var f=url.split('/');	
		var t=f[f.length-2].replace(/\.title.*?$/,'');
		var title='<h2>'+t+'</h2><hr>';
		document.title=t;		
		r=title+marked(r.replace(/<pre>/g, "<pre class='hljs'>"))+ '<hr><small>文档创建: '+fillZero(_r.createtime)+'<br />最后编辑: '+fillZero(_r.updatetime)+'</small>';
		_('#contentCtn').html(r).qAll('img,audio,video,script,link').each(function(o){
			//
			var s=o.src.split('/');
			f[f.length-1]=s[s.length-1];			
			o.src=f.join('/');
			
		});
		
		_('#contentCtn').qAll('code').each(function(o){
			
			o.innerHTML=hljs.highlightAuto(o.textContent).value;
			hljs.lineNumbersBlock(o);
		});
		
		//showList(articles_list);
		t=null;	
	});
		
}
function fillZero(t){
	
	return t.replace(/\d+/g,function(p){			
			if(p.length==1)return '0'+p;
			else return p
		});
}

function showList(e){	
	var arr=e.split('|');
	var posts=[];
	for(var i=0,lng=arr.length-1;i<lng;i+=3){
		var t=arr[i+2];
		t=fillZero(t);
		
		//console.log(t);
		posts.push({url:arr[i],pid:arr[i+1],_updatetime:+t.match(/\d+/g).join(''),updatetime:t})	
	}
	function compare(p){
		return function(m,n){  
			return n[p] - m[p]; 
		}
	}
	posts.sort(compare('_updatetime'));
	
	var htmlArr=[],postTitle='',url;
	var menuJn={};
	var recentNum=0;
	for(var i in posts){
		// console.log(posts[i]);
		 postTitle=posts[i].url.split('/');
		 //if( postTitle.length===1)continue;
		
		 var tit=postTitle[postTitle.length-2].replace(/\.title$/ig,'');
		 var aLink='<a href="./?p='+posts[i].pid+'" title="'+posts[i].updatetime+'" data-pid="'+posts[i].pid+'" data-url="'+posts[i].url+'">'+tit+'</a>'
		 htmlArr.push('<li class="">'+aLink+'</li>');
	
		if(recentNum++<10)getMenu(['最近更新','<small>'+posts[i].updatetime+'</small> '+aLink],0,menuJn);
		
		var p=posts[i].url.split('/');
		p[p.length-2]=aLink;
		p.length--;
		getMenu(p,1,menuJn);
		
	}
	function getMenu(arr,n,menu){
		//console.log(arr[n]);
		if(!menu[arr[n]])menu[arr[n]]={};		
		if(arr[n+1])getMenu(arr,n+1,menu[arr[n]]);
	}
	//getMenu(['aa','bb1','cc1'],0,menuJn);
	//getMenu(['aa','bb2','cc2'],0,menuJn);
	console.log(menuJn);
	var menuHtml=[];
	
	function createMenu(jn,num){
		//menuHtml.push('<div>');
		
		for(var k in jn){
			if(/\.title/.test(k)){				
				menuHtml.push('<div class="posts-link">'+k+'</div>');				
				continue
			}
			menuHtml.push('<div class="menu-'+num+'"><div class="menu-item" data-menu-id="'+num+'">'+k+'</div><div  class="menu-child menu-child-'+num+'">')
			
			if(!/\.title$/.test(k)&&typeof jn[k]==='object'){	
				(function(x){
					x++
				createMenu(jn[k],x);
				})(num)
			}
			menuHtml.push('</div></div>')
		}
		;
		//menuHtml.push('</div>');
	}
	
	createMenu(menuJn,1);
	_('#menuContainer').html(menuHtml.join(''));
	/*_('#posts_list').html(marked(htmlArr.join('')));*/
	var pid=_.localGet('p');
	if(pid){
		loadPid(pid);	
	}else{
		document.title='welcome!';
		_('.menu-child-1').show();
	}
}
showList(articles_list);

_('#menu').on('click',{'data-menu-id':null},function(e){
	var t=_(e.target);
	var c='.menu-child-'+t.attr('data-menu-id');

	t.parent().qAll(c).changeDisplay();
})

			 