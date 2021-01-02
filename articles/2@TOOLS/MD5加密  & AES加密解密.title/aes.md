<style>
textarea{
padding:4px;
width:100%;
height:130px;
}
input{
padding:4px;
width:auto;
}
textarea,input{
border:1px solid gray;
}
button{
padding:5px;
}
</style>

明文:<textarea spellcheck='false' id='input'>
</textarea>
<button id='enc'>AES加密↓</button> <button id='dec'>AES解密↑</button> aes-key:<input value='asdfasdfadf' id='key'/> aes-iv:<input value='abcdef0123456789' id='iv'/><button id='md5'>MD5↓</button><button id='copy'>复制↓</button>
<br>密文:
<textarea  spellcheck='false' id='output'>
</textarea>

<script nocache='true' _src='test_aes.js' ></script>
