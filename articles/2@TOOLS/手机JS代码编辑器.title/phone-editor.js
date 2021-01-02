(function(){
/*"use strict";*/
var iptKw={
'反引':'`','波浪':'~','叹号':'!','圈号':'@','井号':'#','美元':'$','百分':'%','指数':'^','&':'和号','米号':'*','开小':'(','收小':')','下划':'_','加号':'+','减号':'-','等于':'=','开大':'{','收大':'}','开中':'[','收中':']','冒号':':','分号':';','双引':'"','单引':'\'','分隔':'|','反斜':'\\','小于':'<','大于':'>','问号':'?','逗号':',','句点':'.','正斜':'/',
'双大':['{}',-1],'双中':['[]',-1],'双小':['()',-1],'双双':['""',-1],'双单':['\'\'',-1],'双反':['``',-1],
'加加':'++'
}

var maxCutLen = 0;
var KW1=new Map();
var KW2=new Map();
var KW3=new Map();
function setKwMap(kwObj,color){	
	for(let i in kwObj){		
		if (i.length > maxCutLen) maxCutLen = i.length;
		 KW1.set(i,'<span class="my-keyword" style="color:'+color+'">'+i+'</span>');
		 let kw=kwObj[i];		 
		 if(typeof kw=='string'){
		
		  KW2.set(i,kw);
		 }else{
			 KW2.set(i,kw[0]);
			 KW3.set(i,kw[1]);
			 console.info(i)
			// KW3.set(kw[0],kw[1]);
		 }
	}
}
setKwMap(js_keyword.js,'green');
setKwMap(js_keyword.html,'lightblue');
setKwMap(js_keyword.htmlAtt,'hsla(60,100%,38%,1)');
setKwMap(js_keyword.re,'darkred');
function translate(text,map) {	 
    var tArr = text.split('');
    var textLen =text.length;
    var resCheck = [],
    word,
    n,
    len,
    tranText;
	var cutLen=maxCutLen;
    if (maxCutLen > textLen) {
        cutLen = textLen;
    }

    for (var j = cutLen; j > 0; j--) {
        len = textLen - j + 1;
        for (let index = 0; index < len; index++) {
            if (resCheck[index]) {
                //跳过已译位置
                index += resCheck[index] - 1;
                continue;
            }
            word = tArr.slice(index, index + j).join('');
			
            tranText = map.get(word);
            if (!tranText) continue;
            resCheck[index] = j;
            tArr[index] = tranText;
            n = j;
            for (var k = 1; k < j; k++) {
                //resCheck[index]是指向下一个词的相对指针
                resCheck[++index] = n--;
                //清空已译位置i
                tArr[index] = '';
            }
        }
    }

    return tArr.join('');
}

var oldConsoleLog = console.log;
var oldConsoleClear = console.clear;
var onceFunc=function(){
	window.addEventListener('error',  args => {
	 //for(var i in args){	//	 console.log(i,typeof args[i],rgs[i]);	
	 //}
	
	let {error,filename,lineno,colno}=args;
	showError(lineno);
	console.log('ERROR',{error___:error.toString(),filename:filename+'line:'+lineno+'col:'+colno});
		return true;
	 
	}, true);
	console.clear=function(){
		oldConsoleClear&&oldConsoleClear();
		logContent.html('');
	}
	console.log=function(){
		var args=[].slice.call(arguments);
		//要发送的数据-------
		var msg = '',jn=[], len=args.length;
		var obj,type;
		for(var i = 0; i < len; i++){
			 obj = args[i];
			if(typeof obj !== 'string'&& typeof obj !== 'number'){
			try{
				type=Object.prototype.toString.call(obj);
				
				if(/Html/i.test(type)){
					 msg +=obj.tagName;					
				}else if(/Function/i.test(type)){					
					msg +=obj.toString();					
				}else if(/Array/i.test(type)){			
					msg +=JSON.stringify(obj);					
				}else if(/Map/i.test(type)){				
					msg +='[Map]';				
				}else if(/object Object/i.test(type)){
					msg +=JSON.stringify(obj);
				}else {
					msg +=JSON.stringify(obj);	
				}				
				}catch(e){ };
			}else if(typeof obj === 'string'){		
				msg +=obj;
			}else if(typeof obj === 'number'){			
				msg +=obj.toString();
			} else {			
				msg +=obj.toString();
			}		
				msg += ' ';
		}
		_('<div>'+msg.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')+'</div>').ap(logContent,'<]>');
		logContent.node.scrollTop = logContent.node.scrollHeight;
		logContent.node.scrollLeft =0;
		logCtn.show();
	}	
	// 禁用双击放大
	var lastTouchEnd = 0;
	document.addEventListener('touchend', function (event) {		
		var now = Date.now();
		if (now - lastTouchEnd <= 150) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, {
		passive: false
	});
	
	onceFunc=function(){}
}
//全角转半角
function CtoH(str){ 
　var result="";
　for (var i = 0; i < str.length; i++){
　　if (str.charCodeAt(i)==12288){
　　　result+= String.fromCharCode(str.charCodeAt(i)-12256);
　　　continue;
　　}
　　if (str.charCodeAt(i)>65280 && str.charCodeAt(i)<65375) result+= String.fromCharCode(str.charCodeAt(i)-65248);
　　else result+= String.fromCharCode(str.charCodeAt(i));
　}
　return result;
}
//在光标位置插入内容
 function insertAtCursor(jsDom, html) {
	if (jsDom != document.activeElement) { // 如果dom没有获取到焦点，追加
		jsDom.innerHTML = jsDom.innerHTML + html;
		return;
	}
	var sel, range;
	if (window.getSelection) {
		// IE9 或 非IE浏览器
		//debugger
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			sel.addRange(range);
		
		//选中所有文本
             
			range.deleteContents();
			// Range.createContextualFragment() would be useful here but is
			// non-standard and not supported in all browsers (IE9, for one)
			var el = document.createElement("div");
			el.innerHTML = html;
			var frag = document.createDocumentFragment(),
				node, lastNode;
			while ((node = el.firstChild)) {
				lastNode = frag.appendChild(node);
				
			}
			range.insertNode(frag);
			// Preserve the selection
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	} else if (document.selection && document.selection.type != "Control") {
		// IE < 9
		document.selection.createRange().pasteHTML(html);
	}
}
/**
保存与还原光标位置
*/
var saveSelection, restoreSelection;
var editor=document.getElementById("editor");
if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
		var str=preSelectionRange.toString();
        var start = str.length;	
        return {
            start: start,
            end: start + range.toString().length,
			string:str
        }
    };

    restoreSelection = function(containerEl, savedSel) {
		
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;
        
        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
		return node;
    }
} else if (document.selection && document.body.createTextRange) {
    saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };
}

var savedSelection;

function doSave() {
    savedSelection = saveSelection( editor );
	return savedSelection;
}

function doRestore() {
    if (savedSelection) {		
      return  restoreSelection(editor, savedSelection);
    }
}
function doReplace(){
	
	var s=doSave();
	var len=s.string.length;
	var oldStr,newStr;
	var i=10;
	var index=0;
	do{
		oldStr=s.string.substring(len-i,len);	
		newStr=iptKw[oldStr];
		if(typeof newStr==='object'){
			index=newStr[1];
			newStr=newStr[0];		
		}
		i--;
	}while(!newStr&&i>1);
	if(!newStr)return;
	var node=doRestore();	
	var sel = window.getSelection();		
	var _range = sel.getRangeAt(0);	
	var end=_range.endOffset;	
	var start=_range.endOffset-oldStr.length;
	var range = new Range();
	
	range.setStart(node,start);
	range.setEnd(node,end);
	// 应用选择，
	//document.getSelection().removeAllRanges();
	//document.getSelection().addRange(range);
	range.deleteContents();
	
	
	doSave();
	insertAtCursor(edt.node,newStr);	
	/*if(/^({}|[]|\(\)|""|''|``)$/.test(newStr)){
		index=-1;
	}*/	
	savedSelection.start+=newStr.length+index;
	savedSelection.end+=newStr.length+index;
		
	doRestore();    
}
function showError(lineno){
	_('#line-'+(+lineno-2)).addClass('line-error');
	
}
_('.menu-1').vHide();

var edt=_('#editor');
var edtBox=_('#editor-box');
var edtView=_('#editor-view');
var edtLine=_('#editor-line');
var logCtn=_('#console-log-ctn');
var logContent=_('#console-log');
var width=_('#editor').width();
var jscode=_.getValue('jscode');

edt.focus();


//edt.on('keyup',doReplace);

_('#console-clear').on('click',function(){	
	logContent.html('');
});

function getCode(str){
	str=str||edt.html();
	return str.replace(/&nbsp;/g ,' ').replace(/<div><br>/g,'\n').replace(/<\/div>/g,'').replace(/<div>/g,'\n').replace(/<br>/g,'\n').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}
function myJsBeautify(str){
	var output=js_beautify(
		
	getCode(str).replace(/0([\p{Unified_Ideograph}]+)__/ug,'$1').replace(/([\p{Unified_Ideograph}]+)/ug,'0$1__')
	
	);

	// output=hightlight(output);
	//格式化的空格是正常的空格
	output=output.replace(/\n/g,'<br>').replace(/§空格§ |§空格§/g ,' ').replace(/ /g ,'&nbsp;').replace(/0([\p{Unified_Ideograph}]+)__/ug,'$1');
	return output;
}
_('#run-js').on('click',function(){	
	onceFunc();	
	var s=getCode();
	/*保留反引号内的中文*/
	var count=0;
	var save=[];
	s=s.replace(/`(.+)`/g,function(p,p1){
		save.push(p1);
		return '`_`';
	});	
	s=translate(s,KW2);
	s=s.replace(/`(.+)`/g,function(p){	
		return '`'+save[count++]+'`';
	});
	console.info(save);
	new Function(s)();
		
	});

_.loadJsCss(['./highlight/highlight.pack.js']
	,['./highlight/styles/night-owl.css'],function(){
	_('#js-format').on('click',function(){
		//这里全角转半角了!
		//var js_source_text=CtoH(getCode()), indent_size, indent_character, indent_level		
		
		edt.html(myJsBeautify());		
		edt.on('keyup');		
		saveCode(1);
	});
	
	
	edt.on('keyup',function(e){	
		doReplace();
		var code= edt.html();
		var num=1;
		var lineHtml='';
		
		edtView.html(code);		
		var width=edt.width();
		var height=edt.height();
		edtView.height(height);//.width(width);
		edtBox.height(height+40);//.width(width);	
		edtLine.height(height);
		var lineNum=+parseInt(height/22);	
		
		var d=12+lineNum.toString().length*12;
		for(var i=0,n;i<lineNum;i++){
			n=i+1;
			lineHtml+='<ul id="line-'+n+'">'+n+'</ul>';
		}
	
		edtLine.html(lineHtml);
		edtLine.css({'width':d+'px','top':'16px','left':'0px'});
		edtView.css({'paddingLeft':d+'px','top':'16px','left':'5px'});
		edt.css({'paddingLeft':d+'px','top':'16px','left':'5px'});
		code=code.replace(/<div><br>/g,'\n').replace(/<\/div>/g,'').replace(/<div>/g,'\n').replace(/<br>/g,'\n').replace(/&nbsp;/g,'▲䨺').replace(/&lt;/g,'<',).replace(/&gt;/g,'>').replace(/&amp;/g,'&');
		//高亮结果含有html标签 ,里面含有空格
	
		code=hljs.highlightAuto(code).value;
		code=translate(code,KW1);
	
		code=code.replace(/\n/g,'<br />').replace(/▲䨺/gm ,'&nbsp;');
		//.replace(/&nbsp;/g,'');//.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/&/g,'&amp;')

		
		edtView.html(code);
		saveCode(3000);
	}).on('click.kw',function(e){
	/*有未知bug */
		//相对坐标
		
		var x=e.layerX,y=e.layerY;
		var pX=e.pageX, pY=e.pageY;
		
		_('#editor-view')._qAll('.my-keyword').each(function(o){		
			var w=o.offsetWidth;
			var h=o.offsetHeight;
			//区域
			var x1=o.offsetLeft,y1=o.offsetTop,x2=x1+w,y2=y1+h;
			if(x>x1&&x<x2&&y>y1&&y<y2){
				onceFunc();
				let s=o.innerHTML;
				//console.clear();
				let tips='';
				if(KW3.has(s)){
					tips='\n'+myJsBeautify(KW3.get(s)).replace(/<br>/g,'\n');
				}
				console.log(s,KW2.get(s),tips);				
			}
		});
	
	});
	_('#js-read').on('click',function(){
		var s=_.getValue('jsSave');
		edt.html(s);
		edt.on('keyup');
	});
	edt.pasteTextOnly(function(){
		
		edt.on('keyup');	
		
			
	});
	if(jscode){
	//var str=getCode(jscode);	
	//console.log(output);
	edt.html(jscode);
	_('#js-format').on('click');
	//edt.on('keyup');
	}
});
var timer;
function saveCode(t){
	clearTimeout(timer)
	timer=setTimeout(function(){
		var str=getCode();
		_.setValue('jscode',edt.html());
	},t);
	
	
}


_('#js-save').on('click',function(){
	
	_.setValue('jsSave',edt.html());
});

_('#set-log-ctn-height').drag(function(e,o){
	logContent.css({'maxHeight':o.value+'px'});
});
/*
令 cvs = 文档.创建元素('画布');
令 ctx = cvs.获取上下文('2d');
cvs.宽 = 300;
cvs.高 = 200;
文档.主体.插入前面(cvs, 文档.主体.第一个子);
ctx.描边样式 = 'green';
ctx.开始路径();
ctx.移动到(0, 0);
ctx.连线到(300, 150);
ctx.描边();*/

})();