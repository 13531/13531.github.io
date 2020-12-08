var s="<script  src = 'abc.js' aabbc = true >console.log('test')</script>"
s="<script>console.log('test')</script>"
s=s.replace(/\s+([\d\w-]+)[\s+]?=[\s+]?["'](.*?)["']/g,function(p,p1,p2){
	console.log(p1,p2);
	return " ";
}).replace(/\s+([\d\w-]+)[\s+]?=[\s+]?([\d\w-]+)/g,function(p,p1,p2){
	console.log(p1,p2);
	return " ";
}).replace(/<script(.*?)?>(.*?)<?\/script>/g,function(p,p1,p2,p3){
	console.log(p2);
	
})
