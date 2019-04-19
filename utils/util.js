const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 判断对象是否为空
 */
const isEmpty = obj => {
  if (obj == null || obj == undefined || obj == '') {
    return true
  } else {
    return false
  }
}

//md5加密用
const signKey = 'Vfd5Eh8HPvHIqpyno1OX'

//aes加密用
//const aesKey = '8n64jliKdUfZb0Ar4HzlCnYgGW1FuXS9'
//const iv = '0102030405060708'

//const api1 = 'https://www.easy-mock.com/mock/5c6c15b5ab815c130b4720c7/example/IndexList'
const baseUrl = 'http://127.0.0.1:8080'
const apiLogin = '/api/gps/login.do'

/**
 * 显示toast
 * @title 显示内容
 */
const showToast = (title) => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 3000
  })
}

/**
 * 请求api
 * @url 请求地址
 * @params 请求参数
 * @successFunction 成功的回调方法
 * @failFunction 失败的回调方法
 */
const doApi = (url, params, successFunction, failFunction) => {
  wx.showLoading({
    title: '加载中......',
  })

  wx.request({
    url: baseUrl + url,
    method:'POST',
    data: params,
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      wx.hideLoading()
      if (typeof successFunction == "function") {
        successFunction(res);
      }
    },
    fail: function(res) {
      wx.hideLoading()
      if (typeof failFunction == "function") {
        failFunction(res);
      }
    }
  })
}

const CryptoJS = require('../assets/js/aes/aes.js')
var key = CryptoJS.enc.Utf8.parse("8n64jliKdUfZb0Ar4HzlCnYgGW1FuXS9");//十六位十六进制数作为秘钥
var iv = CryptoJS.enc.Utf8.parse('0102030405060708');//十六位十六进制数作为秘钥偏移量

//解密方法
function Decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

function Encrypt(word){
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var hexStr = encrypted.ciphertext.toString().toUpperCase();

  console.log('hexStr->' + hexStr);
  var oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
  // 将密文转为Base64的字符串
  var base64Str = CryptoJS.enc.Base64.stringify(oldHexStr);
  console.log('base64Str->' + base64Str);
  //这里根据需求返回 base64Str 或 hexStr(解密时有小小差别)
  return base64Str;
}

module.exports = {
  signKey: signKey,
  apiLogin: apiLogin,
  formatTime: formatTime,
  isEmpty: isEmpty,
  showToast: showToast,
  doApi: doApi,
  Encrypt: Encrypt
}