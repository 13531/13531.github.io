import _ from "./ap.js";
	
_('body').show();
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
	

_.get('./txt/readme.md.txt?t=a'+Math.random(),function(r){
		
		_('#show_content').html(marked(r));
});
_('body').on('click',{class:"post-link"},function(e){
	var t=_(e.target);
	console.log(t.attr('data-url'))
	_.get(t.attr('data-url')+'?t=a'+Math.random(),function(r){
		
		_('#show_content').html(marked(r));
	});


})
_.get('./txt/___posts_list.html?t='+Math.random(),function(e){
	
	var arr=e.split('|');
	var posts=[];
	for(var i=0,lng=arr.length-1;i<lng;i+=2){
		var t=arr[i+1];
		t=t.match(/\d+/g).join('');
		posts.push({url:arr[i].replace(/\\/g,'/'),updatetime:+t,_updatetime:arr[i+1]})	
	}
	function compare(p){
		return function(m,n){  
			return n[p] - m[p]; 
		}
	}
	posts.sort(compare('updatetime'));
	var htmlArr=[],postTitle='',url;
	for(var i in posts){
	// console.log(posts[i]);
	 postTitle=posts[i].url.split('/');
	 htmlArr.push('<li class="layui-nav-item layui-nav-itemed"><a href="javascript:;" title="'+posts[i]._updatetime+'" class="post-link cc" data-url="./txt'+posts[i].url+'">'+postTitle[postTitle.length-1].replace(/\.txt$/ig,'')+'</a></li>');
	}
	//console.log(htmlArr)
	_('#posts_list').html(marked(htmlArr.join('')));

});