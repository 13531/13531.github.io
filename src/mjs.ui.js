(function(){

var xx={
	createBox:function(){
		var box={
		container:_('<div></div>').attr({'style':'display:none;position:absolute;background:#fff;'}),
		title:_('<span></span>').html('标题'),
		content:_('<div></div>'),
		shutBtn:_('<span></span>').html('×').attr({'style':'cursor:default;font-size:25px;position:absolute;right:5px;top:-2px;'}),
		}
		box.shutBtn.on('click',function(){
			box.container.hide()
			box.container.setPos(-9999,-9999)
		});
		box.container.ap('<]>',box.title ,box.shutBtn, box.content);
		_('body').ap('<]>',box.container);
		return box;
	}

}


var fn_xx={
	test:function(){
	console.log(1111);
	}		
}
	

	
	
	
	
_.extend(xx);	
_.fn.extend(fn_xx);
	
})();