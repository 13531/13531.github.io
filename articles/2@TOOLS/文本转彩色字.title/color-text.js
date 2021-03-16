(function(){

function toDBC(str){
    var result = "";
    var len = str.length;
    for(var i=0;i<len;i++)
    {
        var cCode = str.charCodeAt(i);
        //全角与半角相差（除空格外）：65248(十进制)
        cCode = (cCode>=0x0021 && cCode<=0x007E)?(cCode + 65248) : cCode;
        //处理空格
        cCode = (cCode==0x0020)?0x03000:cCode;
        result += String.fromCharCode(cCode);
    }
    return result;
}
function randomColor(){
	//return "black";
    var r=Math.floor(Math.random()*256);
    var g=Math.floor(Math.random()*256);
    var b=Math.floor(Math.random()*256);
    return "rgba("+r+","+g+","+b+",0.8)";
}
function draw(o,ctx,canvas){	
	
	
	
	
	let text_x=0,
	text_y=o.size;	
	var c,code;
	var arr=o.text.split('');
	var lng=arr.length;
	var count=0;
	var time=1;
	if(ctx)console.time('计时1');
	var angle=0;
	
	o.text= toDBC(o.text);
	
	
	

	
		[].map.call( o.text, 
	function( c ) { 
	
		let code=c.charCodeAt(0);
		text_x+=(code<128?o.size/2:o.size)*1.2;
		if(code==10||code==13||text_x+o.size>o.width){
			text_x=0;
			text_y+=o.size+12;
		}
	});
	if(!ctx){
			_('#cvs-ctn').html('');
			canvas=document.createElement('canvas');
			canvas.style='border:1px solid red';
			ctx=canvas.getContext('2d');
			_('#cvs-ctn').ap('<]>',canvas);
		//	document.body.appendChild(canvas);
			canvas.width=o.width+o.size*1.2;
			canvas.height=text_y+o.size*1.2;
			ctx.font=o.size+'px yahei ';
			ctx.fillStyle=o.bgColor;
			ctx.fillRect(0,0,canvas.width,canvas.height);
			ctx.fillStyle=o.color;		
			//draw(o,ctx,canvas);
			
		}
		text_x=0,
	text_y=o.size;	
	_.timerEach(arr,0,function(c){		
		if(ctx){			
			ctx.save();			
			let x=text_x,y=text_y;
			ctx.translate(x+o.size,y);			
			if(o.rotate>0)ctx.rotate(o.rotate*0.01*(Math.random()*90-45)*Math.PI/180);	
			ctx.scale(1+Math.random()*0.6,1+Math.random()*0.6);	
			ctx.fillStyle='rgba(0,0,0,.85)';
			ctx.fillText(c,-o.size/2-0.5,o.size/2-0.5);
			/*ctx.fillStyle='rgba(256,256,256,.85)';
			ctx.fillText(c,-o.size/2+0.5,o.size/2+0.5);	*/
			ctx.fillStyle=randomColor()			
			ctx.fillText(c,-o.size/2,o.size/2);				
			ctx.restore();			
		}
		let code=c.charCodeAt(0);
		text_x+=(code<128?o.size/2:o.size)*1.2;
		if(code==10||code==13||text_x+o.size>o.width){
			text_x=0;
			text_y+=o.size+12;
		}
		
	},function(){
		
		
		
		var g=document.getElementById('img-create');
		if(g)g.parentNode.removeChild(g);
		var img=document.createElement('img');
		img.src=canvas.toDataURL();
		img.id='img-create';
		
		document.getElementById('img-ctn').appendChild(img);	
		console.timeEnd('计时1');
		
		
		
	},1);


	
}
/*
draw({
	text:'我听到传来的谁的声音象那梦里呜咽中的小河我看到远去的谁的步伐遮住告别时哀伤的眼神不明白的是为何你情愿让风尘刻画你的样子是否来迟了命运的渊源早谢了你的笑容我的心情那悲歌总会在梦中惊醒诉说一点哀伤过的往事那看似满不在乎转过身的是风干泪眼后萧瑟的影子不明白的是为何人世间总不能溶解你的样子是否来迟了明日的渊源早谢了你的笑容我的心情不变的你伫立在茫茫的尘世中聪明的孩子提着心爱的灯笼潇洒的你将心事化进尘缘中孤独的孩子你是造物的恩宠',
	size:18,
	color:'#000',
	bgColor:'rgba(255,255,255,0)',
	width:300
});
*/
btnDraw();
document.getElementById('submit').onclick= btnDraw;
_('#range').drag(btnDraw);
_('#range2').drag(btnDraw);

function btnDraw(){	
draw({
	text:document.getElementById('text').value,
	size:parseInt(document.getElementById('range2').value),
	color:'#000',
	bgColor:'rgba(0,0,0,0)',
	width:365,
	rotate:parseInt(document.getElementById('range').value)
	});
	console.log(this.value);
}
document.getElementById('clearText').onclick=function(){
	document.getElementById('text').value='';
}
})();