<style>
input{

padding:4px;
}
.url{
width:90%;
}
.frame-ctn{
margin-top:20px;
width:100%;

}
#frame{
width:100%;
height:500px;
}
</style>
<div class="url-ctn">网址 <input id="url" class="input url" />
</div>
<div class="time-ctn">刷新频率(秒/次) <input value="10" maxlength="10" class="input" id="period"/>
</div>
<div class="time-ctn">已刷新次数 <input readonly maxlength="10" class="input" id="count-ctn"/>
</div>
<div>
<button id="start">开始刷新</button>
</div>
<script nocache="true" src="auto_refresh.js"></script>

<div class="frame-ctn">
<frameset cols="100%,100%,25%">
  <iframe id="frame" src="" />

</frameset>
</div>
