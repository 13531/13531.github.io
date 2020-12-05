var public_key = '0123456789abcdef'; // 密钥, AES-128 需 16 字符, AES-256 需要32个字符, 
var public_iv = 'abcdef0123456789';  // 初始向量 initial vector 16 个字符
//上传密码 1
/*var key=fillkey('000008');*/
// key = fillKey(key); //如果密码不足 16位, 需 `\x00` 填充
/*public_key = CryptoJS.enc.Utf8.parse(public_key);*/
/*public_iv = CryptoJS.enc.Utf8.parse(public_iv);*/

var  public_cfg = {
  iv: CryptoJS.enc.Utf8.parse(public_iv),
  mode: CryptoJS.mode.CBC,
  padding:  CryptoJS.pad.Pkcs7
};
/* aes */
// 加密
function Encrypt (text,key) {
	key=fillkey(key);
  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key),  public_cfg).toString()
}
// 解密
function Decrypt (text,key) {
	key=fillkey(key);
  let decrypted =CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key),  public_cfg)
  return decrypted.toString(CryptoJS.enc.Utf8)
}
function fillkey(k){
  return (Array(16).join('0')+k).slice(-16);//截取后16位
}
/* md5*/
function md5(str){
return CryptoJS.MD5(str).toString();
}
 

