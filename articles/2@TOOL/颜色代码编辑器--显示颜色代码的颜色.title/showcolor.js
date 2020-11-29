var cvs=_('<canvas width="1" height="1"></canvas>').node;
var ctx=cvs.getContext("2d");
function hexify(color) {
  var values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',');
  var a = parseFloat(values[3] || 1),
      r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
      g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
      b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
  return "#" +
    ("0" + r.toString(16)).slice(-2) +
    ("0" + g.toString(16)).slice(-2) +
    ("0" + b.toString(16)).slice(-2);
}
function rgbToHsl(r, g, b){
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;
	if(max == min){
	//	h = s = 0; // achromatic
	}else{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [Math.floor(h*360), Math.round(s*100)+"%", Math.round(l*100)+"%"];

}

function getHslaRgb(color){
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1, 1);
	var data=ctx.getImageData(0,0,1,1).data;
	//console.log(`rgba(${data[0]},${data[1]},${data[2]})`);
	var hsl=rgbToHsl(data[0],data[1],data[2]);
	var hsla= [hsl[0],hsl[1],hsl[2],data[3]/255,data[0],data[1],data[2]];	
	return hsla;
}

/*



*/

var ck=new Map();
var words='LightGoldenRodYellow|MediumSpringGreen|MediumAquaMarine|MediumSlateBlue|MediumTurquoise|MediumVioletRed|BlanchedAlmond|CornflowerBlue|DarkOliveGreen|LightSlateBlue|LightSlateGray|LightSteelBlue|MediumSeaGreen|DarkGoldenRod|DarkSlateBlue|DarkSlateGray|DarkTurquoise|LavenderBlush|LightSeaGreen|PaleGoldenRod|PaleTurquoise|PaleVioletRed|AntiqueWhite|DarkSeaGreen|LemonChiffon|LightSkyBlue|MediumOrchid|MediumPurple|MidnightBlue|DarkMagenta|DeepSkyBlue|FloralWhite|ForestGreen|GreenYellow|LightSalmon|LightYellow|NavajoWhite|SaddleBrown|SpringGreen|YellowGreen|Aquamarine|BlueViolet|Chartreuse|Darkorange|DarkOrchid|DarkSalmon|DarkViolet|DodgerBlue|GhostWhite|LightCoral|LightGreen|MediumBlue|PapayaWhip|PowderBlue|SandyBrown|WhiteSmoke|AliceBlue|BurlyWood|CadetBlue|Chocolate|DarkGreen|DarkKhaki|FireBrick|Gainsboro|GoldenRod|IndianRed|LawnGreen|LightBlue|LightCyan|LightGrey|LightPink|LimeGreen|MintCream|MistyRose|OliveDrab|OrangeRed|PaleGreen|PeachPuff|RosyBrown|RoyalBlue|SlateBlue|SlateGray|SteelBlue|Turquoise|VioletRed|Cornsilk|DarkBlue|DarkCyan|DarkGray|DeepPink|Feldspar|HoneyDew|Lavender|Moccasin|SeaGreen|SeaShell|Crimson|DarkRed|DimGray|Fuchsia|HotPink|Magenta|OldLace|SkyBlue|Thistle|Bisque|Indigo|Maroon|Orange|Orchid|Purple|Salmon|Sienna|Silver|Tomato|Violet|Yellow|Azure|Beige|Black|Brown|Coral|Green|Ivory|Khaki|Linen|Olive|Wheat|White|Aqua|Blue|Cyan|Gold|Gray|Lime|Navy|Peru|Pink|Plum|Snow|Teal|Red|Tan';
var wordsArr=words.split(/\|/);
for(var i in wordsArr){	
	var p=wordsArr[i].toLowerCase();
	var r='<span class="edit-color" style="background-color:'+p+'">';
	ck.set(p,r);
}

function getColorMap(x){
	var n=x.toLowerCase();
	if(ck.has(n)){	
		return ck.get(n)+x+'</span>';
	}else{
		return x;
	}
	
	
}

var colorCode=function(p){	
	return '<span class="edit-color" style="background-color:'+arguments[0]+'">'+arguments[0]+'</span>'
}
var colorName=function(p,p1,p2){
	return arguments[1]+getColorMap(arguments[2]);
	}

var testColor=function(p){
	
	var c='';
	//if(p==='\\\\')c='pink';
	if(p==='\\w')c='green';
	if(p==='\\d')c='blue';
	if(p==='\\s')c='white';
	if(p==='\\b')c='linghtblue';
	if(p==='\\n')c='linghtblue';
	if(p==='\\r')c='linghtblue';
	if(p==='\\t')c='linghtblue';
	if(p==='\\D')c='linghtblue';
	if(p==='\\W')c='linghtblue';
	return '<span style="background-color:'+c+'">'+p+'</span>'
}	
var reArr=[
	[/(#([a-f0-9]{8}|[a-f0-9]{6}|[a-f0-9]{3}))|((rgb|hsl)(a)?\(((\s+)?\d+(%)?(\s)?\,){2}(\s+)?\d+(%)?(\s+)?(,(\s+)?(0|1|0\.\d+|\.\d+))?(\s+)?\))/img,colorCode],	
	[/([^a-z])([a-z]+)/igm, colorName],
	
]


var edt=_('#editor');
var edtView=_('#editor-view');
var edtOuter=_('#editor-outer');
var edtBox=_('#editor-box');
var code= edt.html();

console.log('啊???');
/*备份
(#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))|(rgb(a)?(\s+)?\(((\s+)?\d+(%)?(\s)?\,){2}(\s+)?\d+(%)?(\s+)?(,(\s+)?(0|1|0\.\d+|\.\d+))?(\s+)?\))/igm;
*/
//验证颜色
var re=/(([^a-z])([a-z]+))|(#([a-f0-9]{8}|[a-f0-9]{6}|[a-f0-9]{3}))|((rgb|hsl)(a)?\(((\s+)?\d+(%)?(\s)?\,){2}(\s+)?\d+(%)?(\s+)?(,(\s+)?(0|1|0\.\d+|\.\d+))?(\s+)?\))/img;
//rgb(a)?(\s+)?\(((\s+)?\d+(%)?(\s)?\,){2}(\s+)?\d+(%)?(\s+)?(,(\s+)?[\d\.]+)?(\s+)?\)
function addColor(code){
//console.log(code);
	code= code.replace(/#([a-f0-9]{8}|[a-f0-9]{6}|[a-f0-9]{3})/img,colorCode)
  .replace(/(rgb|hsl)(a)?\(((\s+)?\d+(%)?(\s)?\,){2}(\s+)?\d+(%)?(\s+)?(,(\s+)?(0|1|0\.\d+|\.\d+))?(\s+)?\)/img,colorCode)
  .replace(/([^a-z]|^)([a-z]+)/igm, colorName)
	return code;
}
var xxbox=_.createBox();
var boxCtn=xxbox.container;
var boxContent=xxbox.content;
xxbox.container.css({border:'1px solid gray',textShadow:'1px 1px 1px #FFF',color:'#000'   });
xxbox.title.html('<div style="padding:4px">编辑颜色</div>');

xxbox.content.html(''
+'色　调(Ｈ)<input style="margin:0;"  class="color_hsla"  type="range" id="color_h" value="100" min="0" max="360" step="1"><br>'
+'饱和度(Ｓ)<input style="margin:0"  class="color_hsla"  type="range" id="color_s" value="50" min="0" max="100" step="1"><br>'
+'亮　度(Ｌ)<input style="margin:0"  class="color_hsla"  type="range" id="color_l" value="50" min="0" max="100" step="1" ><br>'

+'红　色(Ｒ)<input style="margin:0;" class="color_rgb" type="range" id="color_r" value="100" min="0" max="255" step="1"><br>'
+'绿　色(Ｇ)<input style="margin:0" class="color_rgb" type="range" id="color_g" value="50" min="0" max="255" step="1"><br>'
+'蓝　色(Ｂ)<input style="margin:0" class="color_rgb" type="range" id="color_b" value="50" min="0" max="255" step="1" ><br>'
+'透明度(Ａ)<input style="margin:0" class="color_rgb color_hsla"  type="range" id="color_a" value="1" min="0" max="1" step="0.01"><br>'
);
var H,S,L,A,R,G,B,COLOR;
var colorIpt={
	h:_('#color_h'),
	s:_('#color_s'),
	l:_('#color_l'),
	a:_('#color_a'),
	r:_('#color_r'),
	g:_('#color_g'),
	b:_('#color_b') 	
}
var setColorConfig=function(color,h,s,l,a,r,g,b){
		var hsla=getHslaRgb(color);
		//初始化调色板


		if(h=='h')colorIpt.h.val( hsla[0]);
		if(s=='s')colorIpt.s.val(parseFloat(hsla[1]));
		if(l=='l')colorIpt.l.val(parseFloat(hsla[2]));
		if(a=='a')colorIpt.a.val(hsla[3]);
		if(r=='r')colorIpt.r.val(hsla[4]);
		if(g=='g')colorIpt.g.val(hsla[5]);
		if(b=='b')colorIpt.b.val(hsla[6]);	
}
edt.on('keyup','*',function(e){	
	var code= edt.html();
	code=addColor(code);
	edtView.html(code);		
	var width=edt.width();
	var height=edt.height();
	edtView.height(height).width(width);
	edtBox.height(height).width(width);		
}).on('click',function(e){
	
	//相对坐标
	var x=e.layerX,y=e.layerY;
	var pX=e.pageX, pY=e.pageY;
	
	boxCtn.show();
	var boxW=boxCtn.width(),boxH=boxCtn.height();
	boxCtn.hide();
	_('#editor-view')._qAll('span').each(function(o){		
		var w=o.offsetWidth;
		var h=o.offsetHeight;
		//区域
		var x1=o.offsetLeft,y1=o.offsetTop,x2=x1+w,y2=y1+h;
		if(x>x1&&x<x2&&y>y1&&y<y2){
			var orginalColor=o.style.backgroundColor;
			edtOuter.css({'backgroundColor':orginalColor});
			var pos=_.findPos(o);
		
			boxCtn.setPos(pos.x,pos.y-boxH+h+10);//.css({'backgroundColor':o.style.backgroundColor});
			
			//设置调色板
			//var hsla=getHsla(orginalColor);
			//初始化调色板
			boxContent.css({'backgroundColor':orginalColor});
			setColorConfig(orginalColor,'h','s','l','a','r','g','b');
		
			
			boxCtn.show().offOn('click',function(){				
				var html=edtView.html();				
				edt.html(html)._qAll('span').each(function(o){	
					_(o).ap('<>[',o.textContent).remove();
				})
				
			})	
			.offOn('mousemove','input',function(e){
				var id=e.target.id;
				H=colorIpt.h.val();
				S=colorIpt.s.val();
				L=colorIpt.l.val();
				A=colorIpt.a.val();
				R=colorIpt.r.val();
				G=colorIpt.g.val();
				B=colorIpt.b.val();					
				//color2=`rgba(${r},${g},${b},${a})`;
				
				if(e.target.className=='color_rgb'){
					COLOR=`rgba(${R},${G},${B},${A})`;					
					setColorConfig(COLOR,'h','s','l','no_a','no_r','no_g','no_b');
				}else if(e.target.className=='color_hsla'){
					COLOR=`hsla(${H},${S}%,${L}%,${A})`;
		
					setColorConfig(COLOR,'no_h','no_s','no_l','no_a','r','g','b');
				}else{
					COLOR=`rgba(${R},${G},${B},${A})`;
					setColorConfig(COLOR,'h','s','l','no_a','r','g','b');
				}				
				boxContent.css({'backgroundColor':COLOR});
				_(o).css({'backgroundColor':COLOR});
				
			}).offOn('change','input',function(e){
			//var color=boxCtn.css('backgroundColor');				
				//_(o).html(hexify(COLOR));
				_(o).html(COLOR);
				var html=edtView.html();
				//console.log(html);
				edt.html(html)._qAll('span').each(function(x){	
					_(x).ap('<>[',o.textContent).remove();
				})
			});
			return true;			
		}
	});
	
}).on('dblclick','*',function(e){
	edt.hide();
});
edtView.on('dblclick','*',function(e){
	edt.show();
});

edt.pasteTextOnly(function(){

	
});

edt.on('keyup').test();

//console.log(edt);
_.lockBackspace();





