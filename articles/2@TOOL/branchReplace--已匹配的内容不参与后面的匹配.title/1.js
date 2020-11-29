var textCtn=_('#text-val');

var text=textCtn.html();

var reArr=[
	[/aaa/ig,function(p){return '<b>'+p+'</b>'}],	
	[/bbb/ig,'BBB'],
	[/ccc/ig,'CCC'],
	[/asdff/ig,'asdff'],	
	[/ccc/ig,'_c_']	
]


var res=branchReplace(text,reArr);


console.log(res);
_('#result-ctn').html(res);
//console.log('结果:',resStr);
//resCtn.html(resStr.join(''));