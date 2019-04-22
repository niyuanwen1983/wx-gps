//通用js

//md5加密用
const signKey = 'Vfd5Eh8HPvHIqpyno1OX'

//aes加密用
const _aesKey = '8n64jliKdUfZb0Ar4HzlCnYgGW1FuXS9'
const _iv = '0102030405060708'

//调试接口地址
const baseUrl = 'http://www.zhifubank.com.cn:8099/mogo'

//登录接口
const apiLogin = '/api/gps/login.do'
//发送验证码接口
const apiSendSms = '/api/gps/sendSms.do'
//消息中心接口
const apiMessage = '/api/gps/getMassage.do'
//详情接口
const apiConfig = '/api/gps/config.do'

const md5 = require('../assets/js/md5/md5.js')

/**
 * 请求api
 * @url 请求地址
 * @params 请求参数
 * @successFunction 成功的回调方法
 * @failFunction 失败的回调方法
 */
const doApi = (url, param, successFunction, failFunction) => {
  wx.showLoading({
    title: '加载中......',
  })

  //获取openid（obj.openid）
  let obj = wx.getStorageSync('user');
  //获取手机型号
  let device = wx.getStorageSync('device');
  //获取时间
  let timeM = new Date()
  let timeParam = timeM.getTime()
  //sign
  let sign = md5.hexMD5(param + signKey + timeParam)
  //参数值
  var paramData = Encrypt(param)

  let params = {
    "source": 2,
    "token": obj.openid,
    "sign": sign,
    "data": paramData,
    "deviceId": device,
    "time": timeParam
  }

  wx.request({
    url: baseUrl + url,
    method: 'POST',
    data: params,
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      wx.hideLoading()

      //成功
      if (res.data.respCode == 1) {
        if (typeof successFunction == "function") {
          successFunction(res);
        }
      } else { //失败
        if (isEmpty(res.data.respMsg)) {
          showToast('请求失败，请重试！')
        } else {
          showToast(res.data.respMsg)
        }
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

/**
 * 请求apiMock
 * @url 请求地址
 * @params 请求参数
 * @successFunction 成功的回调方法
 * @failFunction 失败的回调方法
 */
const doApiMock = (url, param, successFunction, failFunction) => {
  wx.showLoading({
    title: '加载中......',
  })

  wx.request({
    url: url,
    method: 'GET',
    data: {},
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      wx.hideLoading()

      //成功
      if (res.data.respCode == 1) {
        if (typeof successFunction == "function") {
          successFunction(res);
        }
      } else { //失败
        if (isEmpty(res.data.respMsg)) {
          showToast('请求失败，请重试！')
        } else {
          showToast(res.data.respMsg)
        }
      }
    },
    fail: function (res) {
      wx.hideLoading()
      if (typeof failFunction == "function") {
        failFunction(res);
      }
    }
  })
}

//aes加密部分----------------------------------------------------------------------
const CryptoJS = require('../assets/js/aes/aes.js')
const key = CryptoJS.enc.Utf8.parse(_aesKey); //十六位十六进制数作为秘钥
const iv = CryptoJS.enc.Utf8.parse(_iv); //十六位十六进制数作为秘钥偏移量

//解密方法
function Decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

function Encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  var hexStr = encrypted.ciphertext.toString().toUpperCase();

  console.log('hexStr->' + hexStr);
  var oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
  // 将密文转为Base64的字符串
  var base64Str = CryptoJS.enc.Base64.stringify(oldHexStr);
  console.log('base64Str->' + base64Str);
  //这里根据需求返回 base64Str 或 hexStr(解密时有小小差别)
  return base64Str;
}

//通用方法部分-----------------------------------------------------------------------
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

//模块导出部分-----------------------------------------------------------------------
module.exports = {
  apiLogin: apiLogin,
  apiSendSms: apiSendSms,
  apiMessage: apiMessage,
  apiConfig: apiConfig,
  isEmpty: isEmpty,
  showToast: showToast,
  doApi: doApi,
  doApiMock: doApiMock
}