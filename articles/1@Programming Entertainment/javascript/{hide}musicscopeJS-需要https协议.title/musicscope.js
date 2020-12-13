// fork getUserMedia for multiple browser versions, for those
// that need prefixes

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

// set up forked web audio context, for multiple browsers
// window. is needed otherwise Safari explodes

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var voiceSelect = document.getElementById("voice");
var source;
var stream;

 

//set up the different audio nodes we will use for the app

var analyser = audioCtx.createAnalyser();

//analyser.minDecibels = -90;
//analyser.maxDecibels = -60;
analyser.smoothingTimeConstant = 0.005;

var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();




// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion


var move_x=26;//平移

var keyToNote=[];
var noteToKey=[];
var noteToDoremi=[];
var _note=['C','#C','D','#D','E','F','#F','G','#G','A','#A','B',];
var _doremi=['1','#1','2','#2','3','4','#4','5','#5','6','#6','7','1','#1','2','#2','3','4','#4','5','#5','6','#6','7','1','#1','2','#2','3','4','#4','5','#5','6','#6','7'];
var count=0;
for(var i=0,j;i<9;i++){
  for(j in _note){
	keyToNote[_note[j]+i]=-9+count++;
	noteToKey[keyToNote[_note[j]+i]]=_note[j]+i;
	 //noteToDoremi[keyToNote[_note[j]+i]]=_doremi[j];
  }
} 

//数字行键
document.body.onkeyup=function(e){
	var a=e.keyCode-48
	if(a>0&&a<13){			
		drawTable(a)
	}else{
		switch(e.keyCode){
			case 192:drawTable(0);break;
			case 48:drawTable(10);break;
			case 173:drawTable(11);break;
			case 61:drawTable(12);break;
		}
	}
}
//声音频率 
		var A0=27.5;
		var hzToX=[];
		var _hzToX=[];
		var yf=[];		
		var tmp=A0;
		var tmp2=A0;
		var keyArr=[];
		var hz;//璧嬪€间负Hz 鐨勫崄鍊?
		var keyMeter=20;
		var fftSize=4096*8;
		var N=fftSize;
		var sHzToX=[];
		
	//4096
		for(var i=0;i<=88;i++){					
			
			hz=parseInt(tmp*10);//i=0 hz=275
			hzToX[hz]=i*20;//hz对应表格坐标
			sHzToX[hz]=i*100; // hz精细坐标
			//keyArr[i]=hz;
			tmp2=tmp;
			//keyArr.push(parseInt(tmp*10));
			for(var j=0;j<99;j++){
				tmp2*=1.00057779;//音分				
				hz=Math.round(tmp2*10);
				hzToX[hz]=i*20+Math.round(j/5);
				sHzToX[hz]=i*100+j+1;
			}
			tmp*=1.0594630943593;//半音差距
			
		}
		hzToX[0]=0;
		sHzToX[0]=0;
		//频率对应的横坐标
		 //只有hzToX[音高]有值，其他的要填充；
		 //每个频率x10 对应坐标
		for(var i=0;i<audioCtx.sampleRate;i++){
			
		if(!hzToX[i]){hzToX[i]=hzToX[i-1];}
			if(!sHzToX[i])sHzToX[i]=sHzToX[i-1];
			
		}
		console.log(hzToX,sHzToX);
		var count=0;
		var counthzToX=[];

		
//--假设采样频率为Fs，采样点数为N，做FFT之后，某一点n（n从1开始）表示的频率为：Fn=(n-1)*Fs/N；
/*
8000Hz 电话所用采样率，对于人的说话已经足够
11025Hz 获得的声音称为电话音质，基本上能让你分辨出通话人的声音
22050Hz 无线电广播所用采样率，广播音质
32000Hz miniDV数码视频camcorder、DAT(LPmode)所用采样率
44100Hz 音频CD，也常用于MPEG-1音频（VCD，SVCD，MP3）所用采样率
*/
//N 是 fftsize=1024  ;  产生512个结果

var FS=11025;//44100/xxx;
var hzStep=audioCtx.sampleRate/N;// 每点的频率增加 console.log(audioCtx.sampleRate);
//初始化fft 每点的频率
var fft_x=[],fft_hz=[],sFft_x=[];
for(var i=0,lng=N/2;i<lng;i++){	
	var hz=Math.round(i*hzStep*10)
	fft_hz[i]=hz;	
	//alert();
	//对应横坐标
	//1720
	fft_x[i]=hzToX[hz];
	//8800
	sFft_x[i]=sHzToX[hz];
	//alert(fft_x[i]);
}
//alert(fft_x[269])
var canvasX=0.5,canvasY=0.5;
var bg_ctx = document.querySelector('#bg_ctx').getContext("2d");
bg_ctx.fillStyle = '';

bg_ctx.fillRect(0, 0,bg_ctx.width,bg_ctx.height);
bg_ctx.translate(canvasX, 0.5);//坐标原点
bg_ctx.lineWidth =1;
bg_ctx.beginPath();


	//表格	
function drawTable(key){
	 var count=0;
	for(var i=0,j;i<21;i++){
	  for(j in _note){
		noteToDoremi[key-21+count++]=_doremi[j];
	  }
	} 
	bg_ctx.strokeStyle ='white';
	bg_ctx.fillStyle ='#eee';
	bg_ctx.fillRect(-10, 0,2000,335);
	bg_ctx.beginPath();
	bg_ctx.strokeStyle = 'rgba(0,0,255,0.5)';
	bg_ctx.fillStyle = 'black';
	for(var i=0;i<88;i++){	
		
		bg_ctx.moveTo(i*20, 0);
		bg_ctx.lineTo(i*20, 300);
		
		noteToKey[i].length>2?bg_ctx.fillText(noteToKey[i],i*20-9,320):bg_ctx.fillText(noteToKey[i],i*20-7,320);
		noteToKey[i].length>2?bg_ctx.fillText(noteToDoremi[i],i*20-6,330):bg_ctx.fillText(noteToDoremi[i],i*20-4,330);	
	}
	//bg_ctx.fillRect(x-wucha/2, y-6-set_y, wucha, wucha);	
	bg_ctx.stroke();	

}



// 钢琴
var vx=0.7,keyCount=0,ds,ks,keyPos=[],keyPosY=[],piano_x;
bg_ctx.lineWidth =0.5;
bg_ctx. strokeStyle = '#fff';
for(var i=0;i<88;i++){	
	ds=(i+1)%12;	
	if(ds==2||ds==5||ds==7||ds==10||ds==0){	
		piano_x=50+keyCount*33.5*vx-11*vx;
		bg_ctx.fillStyle='#000';
		bg_ctx.fillRect(piano_x,350,21*vx,60);
		keyPosY[i]=400;
		keyPos[i]=piano_x+33.5*vx/2-20*vx
	}else{
		piano_x=50+keyCount*33.5*vx;
		bg_ctx. strokeStyle = 'rgba(0,0,0,0.9)';
		bg_ctx.strokeRect(piano_x,350,33.5*vx,98);
		keyCount+=1;
		keyPosY[i]=440;
		keyPos[i]=piano_x+33.5*vx/2-10*vx;	
	}
		
}
bg_ctx.stroke();


drawTable(0);

drawTable(0);
function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = FS,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
	
   curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
	
  }
  
  return curve;
};



//-FFT--------------------------------------------



//----------------------------------



// set up canvas context for visualizer

var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");
canvasCtx.translate(canvasX, 0.5);//坐标原点



var visualSelect = document.getElementById("visual");

var drawVisual;

//main block for doing the audio recording

if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia (
      // constraints - only audio needed for this app
      {
         audio: true
      },
      // Success callback
      function(stream) {
         source = audioCtx.createMediaStreamSource(stream);
         source.connect(analyser);
         analyser.connect(distortion);
         distortion.connect(biquadFilter);
         biquadFilter.connect(convolver);
         convolver.connect(gainNode);
         gainNode.connect(audioCtx.destination);			
      	 visualize();//图形
         voiceChange();

      },

      // Error callback
      function(err) {
         console.log('The following gUM error occured: ' + err);
      }
   );
} else {
   console.log('getUserMedia not supported on your browser!');
}


var drawCount=0;		
function visualize() {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  var visualSetting = visualSelect.value;
  console.log(visualSetting);

  if(visualSetting == "sinewave") {
    analyser.fftSize = fftSize;
    var bufferLength = analyser.fftSize;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    var draw = function() {

      drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);    
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
	canvasCtx.lineWidth = 0.5;  

      canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;
		canvasCtx.moveTo(0, HEIGHT);
      for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i==0) {
          canvasCtx.moveTo(0, HEIGHT);
		   canvasCtx.lineTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }
	
	 canvasCtx.stroke();
	
    };

    draw();

  } else if(visualSetting == "frequencybars") {
	  
    analyser.fftSize = fftSize;//fft 256
    var bufferLengthAlt = analyser.frequencyBinCount;
	
    console.log('bufferLengthAlt:',bufferLengthAlt);

    var dataArrayAlt = new Uint8Array(bufferLengthAlt);
 canvasCtx.fillStyle='rgba(255,255,155,0)';
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
	
	canvasCtx.translate(canvasX, 0.5);
	var hMaxArr=[];
	var hMaxArrB=[];
	var record={x:[],h:[]}
	
    var drawAlt = function() {
		
		
		
      drawVisual = requestAnimationFrame(drawAlt);
	
	if(drawCount++>1){//if(drawCount
	 
	drawCount=0;
	
      analyser.getByteFrequencyData(dataArrayAlt);
	//  alert(dataArrayAlt);
	  //V===================ifft
	  var fftArr=[];
	  
	 for(var i=0; i <bufferLengthAlt;i++) {
		   if(fft_hz[i]<80||fft_hz[i]>41700)fftArr.push(0);
		   else fftArr.push(dataArrayAlt[i]);
		   
	   }
	   //alert(fftArr.length)
	  for(var i=bufferLengthAlt-1; i >=0;i--) {
		   if(fft_hz[i]<80||fft_hz[i]>41700)fftArr.push(0);
		   else fftArr.push(dataArrayAlt[i]);
	   }

	  
	  
	  //A====================ifft
	 // analyser.getFloatFrequencyData(dataArrayAlt);
		
     //   canvasCtx.fillStyle = 'rgb(0, 0, 0)';
     // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
 //线
	canvasCtx.beginPath();
	  canvasCtx.fillStyle='rgba(255,255,155,0)';
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
//
      canvasCtx.lineWidth = 0.5;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
	

      var barHeight;
	  var hMax=0;
	  var hCount=1;
	  var flag=0;
	  var tmpMax=0;
      var x = 0;
	  var y = 0;
	  var Fn;
	  var baseHz=0;
	  var esistXY=[];
	  var maxBarHeight=0;
	  var maxBarHeightConf={};
		//fft频率 绘图
		var x0=0,y0=0;
		var i = 0;
		 var set_y=150;
		var crestX=[];
		//离散
	var buffStep=1;
	
      for(; i < bufferLengthAlt; i+=1) {
		  
		  
		  
		  	x=fft_x[i];						
			//if(i<19)barHeight =0;
			//else 
				barHeight = dataArrayAlt[i]; //能量			
			y=HEIGHT-barHeight-set_y;
				//避免重复绘制一个点
			if(!esistXY[x]){			
				if(i === 0) {
					canvasCtx.moveTo(x,y);
				} else {	
				canvasCtx.lineTo(x, y);	
				}
			}
			esistXY[x]=1;		
				//各个波峰
			if(barHeight>tmpMax){
				//if(barHeight>50){
				
				hMax=barHeight;
				tmpMax=hMax;				
				hMaxArr[hCount]=[i,barHeight,sFft_x[i],x];
				//hMaxArr[hCount].h=barHeight;			
				//}			
				flag=0;				
			}else if(barHeight==0&&flag==0){	
				
				tmpMax=0;					
				hCount++;
				flag=1;
				crestX[x-1]=1;
			}
			//最大波峰
			if(barHeight>maxBarHeight){
				maxBarHeight=barHeight;
			 maxBarHeightConf={hight:barHeight,x:x}
			}
				
	  }
	  if(!maxBarHeight)return;
	
	//hMaxArr.sort(function(a,b){return b[1]-a[1];});
	//hMaxArr=hMaxArr.slice(0,20);
	//hMaxArr.sort(function(a,b){return a[0]-b[0];});
	hMaxArr.sort(function(a,b){return a[2]-b[2];});
	var crestArr=[];
	for(var i in hMaxArr){
		if(hMaxArr[i][1]<maxBarHeight/2)continue;
		crestArr[hMaxArr[i][2]]=hMaxArr[i][2];
	}	
	
	for(var i in crestArr){
		
		//console.log(i);
		
		var n=crestArr[i];
		for(var j=-15;j<16;j++){				
				if(crestArr[(n+1200+j)]){
					document.title=noteToKey[Math.round(n/100)];
				crestArr.length=0;break;
				for(var k=-15;j<16;k++){				
				if(crestArr[(n+1900+k)]){
							document.title=noteToKey[Math.round(n/100)];
						crestArr.length=0;break;
						
						}//1 1 5 泛音						
				}
				
				}//1 1 5 泛音						
		}
		//break;
	}
	
	   //绘制波峰线
	   var wucha=0,tab_x=0;
	   var test_x,tsxt_x1,a;
	    var countNote=[];
		var max=0,val;
		var isA0=0;
	  for(var j=0,lng=hMaxArr.length;j<lng;j++){
		if(!hMaxArr[j])continue;
	
		a=hMaxArr[j][0]; //ftt的x
		
		
		 x=fft_x[a];//表格坐标		 
		var barHeight=dataArrayAlt[a];		
		 y=HEIGHT-barHeight;
		 
		
		
		
		
		
		 if(x==0&&barHeight>1){
			 isA0=1;			 
		 }		
		if(!x||barHeight<15)continue;
				
				hz=fft_hz[a];//精准频率
				 //alert(hz);
				test_x=sHzToX[hz];//表格坐标				
				//;sHzToX[hMaxArr[j]]
				tab_x=Math.round(x/20);
				wucha=Math.abs(x/20-tab_x);
				//var a=Math.round(fft_hz[hMaxArr[j]]/100)*100;
				test=test_x-(parseInt(test_x/100))*100;//音分误差				
				if(test>50)test=test-100;				
				if(test>-26&&test<26)canvasCtx.fillStyle ='blue';
				else if(test>-31&&test<31)canvasCtx.fillStyle ='orange';
				else canvasCtx.fillStyle ='red';				
				wucha*=20;
				var n=noteToDoremi[tab_x];
			/*	//顶部数字
				canvasCtx.fillText(n,x-7,y-10-set_y);
				 //音高
				canvasCtx.fillText(noteToKey[tab_x],x-7,HEIGHT+25-set_y);
				//if(j==0)test='基频'+test; 
				//误差
				canvasCtx.fillText(test,x-7,HEIGHT+10-set_y);	
				 //误差方块
				canvasCtx.fillRect(x-wucha/2, y-6-set_y, wucha, wucha);
				
				 //底部方块				
				canvasCtx.fillRect(x-3, HEIGHT-2-set_y, 2, 5);	
				//基音
				//记录音符出现次数
				//次数最多，最左边的是基音？？
				if(!countNote['x'+n]){countNote['x'+n]={c:1,v:hz,aa:x,a:hz,tx:tab_x};}
				else countNote['x'+n].c++;
				
				if(crestX)for( o=0;o<20;o++){
				if(crestX[x+230+o]){
					//document.title=x+':';
					crestX=0;
				}
				}
				
				*/
				//寻找基音
				//泛音坐标  a+480 a+140
				//for(var k=j;j<lng;k++){
					//var a1=hMaxArr[k][0]; //音频坐标i			
					//if(a1)if(a1-a<245&&a1-a>235)document.title=(a1-a)+':';
				//}
		}//- fo hMaxArr
		/*怎样计算基音
		    
		     找出最大波峰对应的x , 检测低八度是否有波峰x0，
			 如果有波峰，测基音是x0. 经过测试, 这个办法不行。
			 泛音方式
			 在西洋乐器中，所有有音高的乐器的泛音列都遵循着：
			 1 1 5 1 3  5  b7 1 2 3 #4 5 6 b7 还原7 1 的音程关系
			 _1(0) _1(12) 5(19) _1(24) _3(28)  _5(31)  b7(34) _1(36) 2(38) 3(40) #4(42) 5(43) 6(45) b7(46) 还原7(47) 1(48) 的音程关系
			 从左到右检测波峰 x1,如果有对应的泛音，则x1是基音
			 如果存在
		*/
	
		
		
		//统计 共振最多的频率		
		for(var k in  countNote){
			if( countNote[k].c>max){max=countNote[k].c;val=k;}
			
		}
		if(val){		
		//document.title=val+':'+countNote[val].c+':'+countNote[val].v;
		//fix A0 bug
		var x=countNote[val].aa;
		
		var num=countNote[val].tx;
		if(num===12&&isA0==1){
			num-=12;
		}
	
	
		canvasCtx.fillRect(maxBarHeightConf.x,300,20, 13);
		
		//canvasCtx.fillText(countNote[val].a/10,x-7,HEIGHT+40-set_y);
		
		canvasCtx.fillStyle ='pink';
	//键盘显示基音
		if(noteToKey[num].length>2){
			canvasCtx.fillRect(keyPos[num],keyPosY[num]-11,20, 13);
		}else{
			canvasCtx.fillRect(keyPos[num],keyPosY[num]-11,15, 13);
		}
		
		canvasCtx.fillStyle ='black';		
		canvasCtx.fillText(countNote[val].a/10,x-7,HEIGHT+40-set_y);		
		canvasCtx.fillText(noteToKey[num],keyPos[num]+1,keyPosY[num]-2);
		
		} 
		hMaxArr.length=0;		
	  canvasCtx.stroke();
		
    };
	
	}//if(drawCount
    drawAlt();

  } else if(visualSetting == "off") {
	  
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = "red";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  }

}


function voiceChange() {

  distortion.oversample = '4x';
  biquadFilter.gain.value = 0;
  convolver.buffer = undefined;

  var voiceSetting = voiceSelect.value;
  console.log(voiceSetting);

  if(voiceSetting == "distortion") {
    distortion.curve = makeDistortionCurve(400);
  } else if(voiceSetting == "convolver") {
    convolver.buffer = concertHallBuffer;
  } else if(voiceSetting == "biquad") {
    biquadFilter.type = "lowshelf";
    biquadFilter.frequency.value = 1000;
    biquadFilter.gain.value = 25;
  } else if(voiceSetting == "off") {
    console.log("Voice settings turned off");
  }

}

// event listeners to change visualize and voice settings

visualSelect.onchange = function() {
  window.cancelAnimationFrame(drawVisual);
  visualize();
};

voiceSelect.onchange = function() {
  voiceChange();
};
