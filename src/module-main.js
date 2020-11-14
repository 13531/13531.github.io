

loadPid(_.localGet('p'));




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



		//导航
_('.layui-nav-item').on('mouseenter',function(e){
	//隐藏子菜单
	_('.layui-show').removeClass('layui-show');
	//清除标记
	_('.layui-nav-item').removeClass('layui-this layui-mouseenter');
	//添加标记,显示子菜单
	_(e.target).addClass('layui-this layui-mouseenter').find('.layui-nav-child').addClass('layui-show');
}).on('mouseleave',function(e){
	setTimeout(function(){	
		//移除标记
		if(!_(e.target).hasClass('layui-mouseenter'))
		_('.mouseenter-nave-child').removeClass('layui-show mouseenter-nave-child');	
	},100);	
});

_('.layui-nav-child').on('mouseenter',{class:'layui-nav-child'},function(e){
	setTimeout(function(){		
	_('.layui-mouseenter').removeClass('layui-mouseenter');
	},101);
}).on('mouseout',function(e){
	//子菜单标记
	_(e.target).addClass('mouseenter-nave-child');
});
	
function loadPid(pid){
	_.get( './txt/pid/'+pid+'.pid?t='+Math.random(),function(r){
		
		         var    parser = new DOMParser();
            var xmlDoc = parser.parseFromString(r, "text/xml");
			console.log(xmlDoc);
	loadContent('./'+xmlDoc.getElementsByTagName('url')[0].innerHTML);
});
	
}
function loadContent(url){
	if(/^file:\/\//.test(location.href)){
		_('.wrap').show();
		_('#iframe').attr('src',url).show();
		return
	}
	
		_.get( url+'?t=a'+Math.random(),function(r){
				
		//loadContent(t.attr('data-url'),r);	
		var f=url.split('/');
	
		_('#show_content').html(r).find('img,audio,video,script,link').each(function(o){
			//if(/^http/.test(o.src)){return;}
			
			var s=o.src.split('/');
			f[f.length-1]=s[s.length-1];			
			o.src=f.join('/');
			
		});
		t=null;
		//location.href=location.href.replace(/\?pid.*?$/,'')+'#'+url;		

	}
	);
		
}
/*
_.get('./txt/readme.md.txt?t=a'+Math.random(),function(r){
		try{
		_('#show_content').html(marked(r));
		}catch(e){
			_('#show_content').html(r);
		}
		logoAnim(logo);
});*/
//logoAnim(logo);
_('body').on('click',{class:"post-link"},function(e){
	var t=_(e.target);

	var url=t.attr('data-url');
	console.log(url);
	//_('#iframe').attr('src',url);

	loadContent(url);


})
function showList(e){
	
	var arr=e.split('|');
console.log(arr)
	var posts=[];
	for(var i=0,lng=arr.length-1;i<lng;i+=2){
		var t=arr[i+1];
		t=t.match(/\d+/g).join('');
		console.log(arr[i]);
		posts.push({url:arr[i].replace(/\\/g,'/'),updatetime:+t,_updatetime:arr[i+1]})	
	}
	function compare(p){
		return function(m,n){  
			return n[p] - m[p]; 
		}
	}
	posts.sort(compare('updatetime'));
		 console.log('posts',posts)
	var htmlArr=[],postTitle='',url;
	for(var i in posts){
		// console.log(posts[i]);
		 postTitle=posts[i].url.split('/');
		 //if( postTitle.length===1)continue;
		 console.log(posts[i].url)
		 var tit=postTitle[postTitle.length-2].replace(/\.title$/ig,'')
		 htmlArr.push('<li class="layui-nav-item layui-nav-itemed"><a href="javascript:;" title="'+posts[i]._updatetime+'" class="post-link cc" data-url="./txt'+posts[i].url+'">'+tit+'</a></li>');
		 /*if(/\.top$/.test(tit)){
			
				loadContent('./txt'+posts[i].url);
		
		 }*/
		
	}
	//console.log(htmlArr)
	try{
	_('#posts_list').html(marked(htmlArr.join('')));
	}catch(e){
		_('#posts_list').html(htmlArr.join(''));
	}

}
showList(txt_list);


				 