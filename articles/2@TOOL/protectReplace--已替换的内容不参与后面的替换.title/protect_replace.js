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
		return restore(res);
	}
	return res;
}
var textRestore=function(p){

	return p.replace(/𪚥\d+§/g,function(x){	
		
			return textValue[x];
		})
}
var protectReplace=function(str,re,val){	
	return str.replace(re,function(){
		if(typeof val==='string'){
		
		return saveReplace(p,val);	
		}else if(typeof val==='function'){
			
			return val(arguments);
		}
	});	
}
