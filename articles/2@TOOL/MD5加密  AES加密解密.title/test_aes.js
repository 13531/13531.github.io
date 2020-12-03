_.loadJsArr(['./src/CryptoJS/rollups/aes.js','./src/CryptoJS/rollups/md5.js','./src/myCryptoJS.js'],function(){

_('#enc').on('click',function(){
	
	public_cfg = {
  iv: CryptoJS.enc.Utf8.parse(_('#iv').val()),
  mode: CryptoJS.mode.CBC,
  padding:  CryptoJS.pad.Pkcs7
};
	
	var text=_('#input').val();
	var encode=Encrypt (text,_('#key').val());
	_('#output').val(encode);
});

_('#dec').on('click',function(){
	
	public_cfg = {
  iv: CryptoJS.enc.Utf8.parse(_('#iv').val()),
  mode: CryptoJS.mode.CBC,
  padding:  CryptoJS.pad.Pkcs7
};
	var text=_('#output').val();
	var encode=Decrypt (text,_('#key').val());
	_('#input').val(encode);
});

});

_('#md5').on('click',function(){
	var text=_('#input').val();
	var encode=md5(_('#input').val());
	_('#output').val(encode);
});

_('#copy').on('click',function(){

	execCopy(_('#output').val());
});
function execCopy(text) {
  try{
    var input = document.createElement('textarea');
    input.style.opacity  = 0;
    input.style.position = 'absolute';
    input.style.left = '-100000px';
    document.body.appendChild(input);
    input.value = text;
    input.select();
    input.setSelectionRange(0, text.length);
    document.execCommand('copy');    
    document.body.removeChild(input);
    }catch(e){}
    return true;
}