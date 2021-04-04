


//http://192.168.2.90/13531-github/13531.github.io/?p=mathjax&mathjax-code=XGJlZ2lue2VxdWF0aW9ufVxiZWdpbntzcGxpdH0KSChZfFgpJj1cc3VtX3t4XGluIFh9IHAoeClIKFl8WClcXAomPS1cc3VtX3t4XGluIFh9IHAoeClcc3VtX3t5XGluIFl9cCh5fHgpXGxvZyBwKHl8eClcXAomPS1cc3VtX3t4XGluIFh9IFxzdW1fe3lcaW4gWX1wKHkseClcbG9nIHAoeXx4KQpcZW5ke3NwbGl0fVxlbmR7ZXF1YXRpb259



function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

//https://www.nuomiphp.com/eplan/255578.html
function convert() {
      var input = document.getElementById("editor").value.trim();
     var display = document.getElementById("display");
      var button = document.getElementById("submit");
      button.disabled = display.disabled = true;
      output = document.getElementById('output');
      output.innerHTML = '';
     MathJax.texReset();
      var options = MathJax.getMetricsFor(output);
     options.display = display.checked;
      MathJax.tex2chtmlPromise(input, options).then(function (node) {
        output.appendChild(node);
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
      }).catch(function (err) {
        output.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
      }).then(function () {
        button.disabled = display.disabled = false;
      });
    }

var code=_.localGet('mathjax-code');
if(code){
code=b64_to_utf8(code);
_('#editor').val(code);
//var codeEl=_('<div></div>').text(code);
//_('body').ap('<[>',codeEl);
}
//?p=mathjax&mathjax-code=


//https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js
//https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML
_.loadJsArr(['https://polyfill.io/v3/polyfill.min.js?features=es6','https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js'],function(){
	
	_('#editor').on('paste keyup',function(e){
		setTimeout(function(){
	 convert( );	
		},300);
	});
_('#submit').on('click',function(){
	let c=_('#editor').val();
	console.log(c);
	c=utf8_to_b64(c);
	
	let l=location.href.split('?p=');
	let link=l[0]+'?p=mathjax&mathjax-code='+c;
	_('#link').val(l[0]+'?p=mathjax&mathjax-code='+c);
	 convert( );
	 _.execCopy(link);
});
	convert( );	
});
//alert(code);
/*
_.loadJs('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML',function(){
	console.log(MathJax);
	
});*/



