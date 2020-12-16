var mAduio=function(stream,cfg){
	var context = new AudioContext(),  
	microphone = context.createMediaStreamSource(stream),
	processor = context.createScriptProcessor(cfg.bufferSize||4096, cfg.iChannel||1, cfg.oChannel||1), //bufferSize大小，输入channel数，输出channel数
	mp3ReceiveSuccess, currentErrorCallback;

	/************以下**************/
	var lGain = context.createGain(), // 左声道
	//  rGain = context.createGain(),   // 右声道
	//splitter = context.createChannelSplitter(2),  // 分离器 双声道
	//merger = context.createChannelMerger(2),    // 合成器   双声道
	splitter = context.createChannelSplitter(1), // 分离器
	merger = context.createChannelMerger(1), // 合成器
	filter = context.createBiquadFilter(), // 过滤器
	vol = 100, // 音量
	lVol = 100, // 左声道
	rVol = 100 // 右声道
	;
	/*
	→ lGain
	media/麦克风 → splitter         → merger → filter->(processor) → destination
	→ rGain
	 */
	lGain.gain.value = 1 //1;
		// rGain.gain.value = 1//1;
	filter.type = filter.LOWPASS; // 设置过滤类型
	filter.frequency.value = 3400; // 只允许小于800的频率通过

	microphone.connect(splitter);
	splitter.connect(lGain, 0);

	//  splitter.connect( rGain, 1 );
	lGain.connect(merger, 0, 0); //左输入 左声音
	//	rGain.connect( merger, 0, 0 );//右输入 左声音
	// rGain.connect( merger, 0, 1 );
	merger.connect(filter);

	//自动播放
	//filter.connect( context.destination );

	/*************以上*************/
}