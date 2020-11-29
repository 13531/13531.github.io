//_('#frame').attr({'src':_('#url')});


var timer,url,period,count=0;
var countCtn=_("#count-ctn");
_('#start').on('click',function(){
	count=0;
	url=_('#url').val();
	period=_('#period').val()*1000;	
	startTimer();
});

function startTimer(){
	count++;
	countCtn.val(count);
	_('#frame').attr({'src':url});
	if(timer)clearTimeout(timer);
	timer=setTimeout(function(){
		startTimer(period);
	},period);
	
}