console.log('png-to-file.js');
/*解压内容*/
function pngToFile(url,callback){
	var img=document.createElement('img');
	//img.crossOrigin='*';
	img.src=url;

	img.onerror=()=>{
		console.log('图片加载出错',url);
	}
	img.onload = function(){
		//图片宽高特征
		//if(img.height-img.width!==1)return;		
		
		console.log('解码---->');
		var canvas1=document.createElement('canvas');
		var ctx1 = canvas1.getContext('2d');		
		canvas1.width=img.width;
		canvas1.height=img.height;
		ctx1.drawImage(img,0,0);
		
		var typeData;
		if(img.width<4){
			typeData=ctx1.getImageData(0,0,canvas1.width,Math.ceil(4/canvas1.width));			
		}else{
			typeData=ctx1.getImageData(0,0,4,1);
		}		
		var arr=[],ascii;
		//0~15 含有12个可储存位置
		for(var i=0;i<16;i++){
			if(i%4===3)continue;
			ascii=typeData.data[i];
			if(ascii>0)
				arr.push(ascii);
		}

		var fileFlag=numArrayToText(arr);
		console.log('fileFlag--->',fileFlag);
		
		if(fileFlag!=='pngStorage'){
			console.log('格式不同, 无法解码',url);
			return;
		}		
		
		var pngDataIndex=0;	
		var pngData=ctx1.getImageData(0,0,img.width,img.height);
		
		var get255=()=>{
			//跳过透明度
			if(pngDataIndex%4==3)pngDataIndex++;
			return pngData.data[pngDataIndex++];
		}
		
		//n 是连续的可储存位置
		var setStorageIndex=(n)=>{pngDataIndex=n+parseInt(n/3)}
		//return 返回当前可储存位置
		var getStorageIndex=()=>pngDataIndex-parseInt(pngDataIndex/4);
		
	
		//获取数据长度
		var getLength=()=>{
			//长度的长度
			let len=get255();			
			let n255='0x';
			let s='';
			for(let i=0;i<len;i++){
				s=get255().toString(16);				
				n255=n255+ (s.length>1?s:'0'+s);	
			}
			//数据的长度
			let res=parseInt(n255);
			return  {
				dataLength:res,
				wholeLength:len+res
				};
		}
		var getInt8Text=()=>{
			let lng=getLength().dataLength;
			let res=[];
			for(let f=0;f<lng;f++){
				res.push(get255());	
			}
			let str=numArrayToText(res);	
			return str;
		}
		
		setStorageIndex(12);	
		var filesNum=get255();
		console.log('文件个数',filesNum);
		
		/*计算数据大小
		  
		*/
		
		setStorageIndex(13);		
		var size=13;
		var maxSize=canvas1.width*canvas1.height*3;	
		for(var i=0;i<filesNum;i++){
			// message fileType fileName  fileDataLength
			for(var k=0;k<4;k++){
			//下一个数据的入口	
			size+=getLength().wholeLength+1;			
			setStorageIndex(size);
			}
		}
		if(filesNum===0){
			size=getLength().wholeLength;
		}
	
		console.log('数据长度------------->>>>>',size,'图片最大容量:',maxSize);	
		//假如数据出错时造成size过大有可能会卡住浏览器. 在这里拦截错误 ,保证程序在maxSize大小之内解码
		if(typeof size !='number'||String(size)=='NaN'||size>maxSize){
			console.log('数据出错');
			return;
		}
		
	//	console.log('压缩率',(100*dataURLtoBlob(canvas1.toDataURL()).size/size).toFixed(2)+'%');
		
		/*---------------------------
		*提取数据
		*-------------------------*/
		
		//数据入口
		setStorageIndex(13);
		
		//提取文本
		if(filesNum==0){
			let message=getInt8Text();
			//console.log('解码text:',message);
			callback(message);
			return;
		}
		
		//提取文件
		var res=[];
		for(var i=0;i<filesNum;i++){			
			let message=getInt8Text();	
			//console.log('message:',message);
			let fileType=getInt8Text();	
			let fileName=getInt8Text();			
			let fileDataLength=getLength().dataLength;			
			let buffer = new ArrayBuffer( fileDataLength);
			let data = new DataView(buffer);
			let dataCount=0;
			while(dataCount< fileDataLength){
				data.setInt8(dataCount++,127-get255(),  true);					
			}
			let blob = new Blob ( [ data ], { type : fileType} );
			blob.message=message;
			//console.log('testMessage',blob);
			let url=window.URL.createObjectURL(blob);
			//console.log('文件信息:',fileName,fileType,message);
			res.push({
				url:url,
				blob:blob,
				type:fileType,
				name:fileName,
				messsage:message
				});
		}
		callback(res);
	}
}
function numArrayToText(arr){
	var str='';
	var num;
	//ipt=1 english  ,ipt=0 chinese
	var ipt=1;
	for(var i=0,len=arr.length;i<len;i++){
		num=arr[i];			
		if(num==0){
			ipt=ipt==1?0:1;		
			continue;		
		}		
		if(ipt==0){	
			num=(num<<8)+arr[++i];
		}
		str+=String.fromCharCode(num);
	}
	return str;
}


/*
 base64转blob
*/
function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
	bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while(n--){
	  u8arr[n] = bstr.charCodeAt(n);
	}
  return new Blob([u8arr], {type:mime});
} 

function handler(r){
	
	var h=document.getElementsByTagName('HEAD')[0];
	for(var i=0,lng=r.length;i<lng;i++){
		
		if(/css/.test(r[i].type)){
			var link=document.createElement('link');
			
			link.href=r[i].url;
			link.rel='stylesheet';
			h.appendChild(link);			
			
		}else if(/javascript/.test(r[i].type)){
			var s=document.createElement('script')
					s.src=r[i].url;
					s.rel='stylesheet';					
					h.appendChild(s);
					
			/*		
			var reader = new FileReader();
				reader.onload = function(e){
					var s=document.createElement('script')
					var data=e.target.result;
					var tNode=document.createTextNode(data);					
					s.appendChild(tNode);
					h.appendChild(s);	
					if(typeof marked==='function'&&typeof hljs==='object'){					
						initFunc();						
					}
				}
			reader.readAsText(r[i].blob);
			*/
		}
		
		
	}
	var timer;
	var check=function(){
		if(typeof marked==='function'&&typeof hljs==='object'){					
			initFunc();						
		}else{
			if(timer)clearTimeout();
			timer=setTimeout(check,50);
		}
	}
	check();
}
var initFunc=function(){

	hljs.initHighlightingOnLoad();
   var rendererMD = new marked.Renderer();
    marked.setOptions({
        renderer: rendererMD,
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        },
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    });
    var markdownString = '```js\n console.log("hello"); \n```';
    document.getElementById('content').innerHTML = marked(markdownString);
	var s=document.createElement('script')
	s.src='./src/module-main.js';					
	s.type='module';
	document.body.appendChild(s);
}

pngToFile(document.currentScript.getAttribute('main'),handler);