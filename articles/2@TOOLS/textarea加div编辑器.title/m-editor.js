
var edt=_('#editor');
var edtBox=_('#editor-box');
var edtView=_('#editor-view');
edt.on('keyup',function(){
	let code=edt.val();
	console.log(code);
	code=code.replace(/\n/g,'<br>');
	edtView.html(code);	
});