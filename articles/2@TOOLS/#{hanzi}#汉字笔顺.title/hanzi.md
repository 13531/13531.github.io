<style>
/*#canvas{
transform:rotateX(180deg);
}*/
#input{
padding:4px;
font-size:18px;
width:30px;
margin-left:5px;
}
#button{
margin:5px;
padding:5px;
border:1px solid #555;
font-size:20px;
background-color:rgb(210,210,210,.6)
}
#hanzi-history a{
 margin-right:10px;
 font-size:20px;
}
</style>
<div id='hanzi-history'></div>
慢<input id='range' min='1' max='140' value='70' step='1' type='range'/>快
<input id='input' value='字' maxlength=1></input> <button id='button'>查询</button>


<canvas  id='canvas' width=600 height=600></canvas>

<script nocache=true src='hanzi.js'></script>