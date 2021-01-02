<!--template{null}-->

<style>
body{
background:#000;
color:#888;
display:hide;
}
hr{
background:#888;
}
ul{
padding:0!important;
margin:0!important;
}
.code-line{
position:relative;
}
.code-line-number{
position:absolute;
left:-20px;
list-style:none;

}
#editor-box{
padding-top:20px;
padding-bottom:20px;
position:relative;
width:100%;
height:100%;
background: #002b36;
color: #839496;
}
#editor-box pre{
width:100%!important;
/*background-color:rgba(255,255,255,255,0);*/
/*background:rgba(255,255,255,255,0);*/
}

#editor{
caret-color: #919191;
left:0;
top:0px;
color:rgba(255,255,255,0);
}

#editor-view{
background: #002b36;
/*color:rgba(1,1,1,0);*/
top:0;
}

#editor,#editor-view{
top:16px;
line-height:22px;

font-size:16px;
/*font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;*/
margin:0;
padding:0;
border:0px;
	background-color:rgba(1,1,1,0);
padding-left:25px;
padding-right:5px;
	/*white-space: pre-line;*/
	position:absolute;
	left:0;
	
	width:100%;
	height:auto;
	/*text-shadow:1px 1px 1px #000;   */ 
	/*box-shadow: 1px 1px 1px #000;   */
}
 
pre{
background:#002b36;
}
#editor-outer{
padding:10px;
border-top:30px solid #04232b;
position:relative;
background:#7a9197;
}
#editor,#editor-view{
 white-space:nowrap; 
/*word-break:break-all;*/
min-width:100%;
width:auto;
/*display:inline;*/
}
#editor,#editor-view,#editor-box,#editor-line{

margin:0;
overflow-y:hidden;
min-height:60px;

}
#editor-line{
color:#555;
border-right:1px solid #555;
position:absolute;
left:-10px;
top:16px;
text-align:right;
z-index:99;
line-height:22px;
width:30px;
font-size:16px;
/*font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;*/
margin:0;
padding:0;
}





#editor{/*
line-height:22px;
min-height:300px;
border:1px solid #aaa;
padding:5px;
word-break:break-all;
background:#222;
color:#aaa;*/
/*white-space: pre-line;*/
}
#tool{
position:fixed;
left:0px;
width:100%;
bottom:0px;
border-top:1px solid #333;
padding:4px;
background:rgba(10,10,10,.9);
color:#fff;
text-align:center;
}

#console-log-ctn{
left:0px;
width:100%;
position:fixed;
top:0;
background:rgba(80,80,80,.95);
display:none;
z-index:99;
}
#console-log{
border:1px solid #000;

padding:4px;
max-height:60px;
rgba(77, 76, 76, 0.95);
overflow:auto;

}
.button{
margin-top:3px;
margin-bottom:3px;
}
#console-log div:first-child{
border-top:1px solid #aaa;

}
#console-log div{
color:#eee;
border-bottom:1px solid #aaa;
}
.line-error{
  background:#ac0202;
  color:#000;
}
input[type="range"] {
  /*-webkit-box-shadow: 0 1px 0 0px #424242, 0 1px 0 #060607 inset, 0px 2px 10px 0px black inset, 1px 0px 2px rgba(0, 0, 0, 0.4) inset, 0 0px 1px rgba(0, 0, 0, 0.6) inset;*/
  -webkit-appearance: none; /*去除默认样式*/
 /* margin-top: 42px;*/
 margin-left:15px;
  background-color: #777;
  /*border-radius: 15px;*/
 /* width: 80% !important;*/
  -webkit-appearance: none;
  height:3px;
  padding: 0;
  border: none;

  /*input的长度为80%，margin-left的长度为10%*/
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;/*去除默认样式*/
  cursor: default;
  top: 0;
  height: 25px;
  width: 25px;
  transform: translateY(0px);
  /*background: none repeat scroll 0 0 #5891f5;*/
  background: #777;
  border-radius: 25px;
  border: 5px solid #006eb3;
  /*-webkit-box-shadow: 0 -1px 1px #fc7701 inset;*/
}

</style>
# CHAVASCRIPT 

`~!@#$%^&*()_+-=<br>
反引,波浪,叹号,<b>圈号</b>,井号,<b>美元</b>,百分,指数,<b>和号</b>,米号,<b>开小</b>,<b>收小</b>,下划,加号,减号,等于<br>

{}[]:;"'|\ <>?,./ <br>

<b>开大,收大,开中,收中 </b>,冒号,分号,双引,单引,分隔,反斜<b>小于,大于</b>,问号,逗号,句点,正斜

<b>双大,双中,双小,双双,双单,双反</b> (自动补全符号)

输出中文关键字 使用反引号 `` 例如: 警告框(\`由\`);
 
 CSS<input type="checkbox">  JS<input type="checkbox">  <input type="checkbox">  <input type="checkbox">  <input type="checkbox"> 
<pre>
<div id='editor-box' >
<code id='editor-view'></code>
<code  id='editor'  spellcheck="false" contenteditable ></code>
<code id='editor-line'></code>
</div>
</pre>

<div id='console-log-ctn'>
<button class='button' id='console-clear'>清空</button><input style='padding-top:4px' min=10 max=400 setp=2 max id='set-log-ctn-height' value='40' type='range' /> <div id='console-log'></div>
</div>
<div id='tool'>
<button class='button' id='js-save'>保存</button>
<button class='button' id='js-read'>读取</button>
<button class='button' id='js-format'>格式美化</button>
<button  class='button' id='run-js'>运行</button>
</div>

<script  _src='jsbeautify.js'></script>
<script nocache='true' _src='js_keyword.js'></script>
<script nocache='true' _src='phone-editor.js'></script>