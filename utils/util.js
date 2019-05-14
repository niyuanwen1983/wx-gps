//通用js

//qq的gps定位key
const QQKey = 'ZHFBZ-5GRWV-T66PL-UDEEL-NYNQJ-FMFQI'

//md5加密用
const signKey = 'Vfd5Eh8HPvHIqpyno1OX'

//aes加密用
const _aesKey = '8n64jliKdUfZb0Ar4HzlCnYgGW1FuXS9'
const _iv = '0102030405060708'

//调试接口地址
const baseUrl = 'https://www.zhifubank.com.cn:8099/mogo'
//小程序版本号
const version = '1.0.0'

//登录接口
const apiLogin = '/api/gps/login.do'
//发送验证码接口
const apiSendSms = '/api/gps/sendSms.do'
//消息中心接口
const apiMessage = '/api/gps/getMassage.do'
//详情接口
const apiConfig = '/api/gps/config.do'
//我的首页接口
const apiMe = '/api/gps/queryReport.do'
//工单首页接口
const apiTaskList = '/api/gps/workOrderList.do'
//接单状态更新接口
const apiTaskUpdate = '/api/gps/updateOrderStatus.do'
//工单详情接口
const apiTaskDetail = '/api/gps/workOrderInfo.do'
//文件上传接口
const apiFileUpload = '/api/gps/uploadFile.do'
//保存gps信息接口
const apiGpsSave = '/api/gps/saveGpsInfo.do'
//文件删除接口
const apiDelFile = '/api/gps/delFile.do'
//获取openid接口
const apiGetOpenid = '/api/gps/getOpenId.do'

const md5 = require('../assets/js/md5/md5.js')

/**
 * 请求api
 * @url 请求地址
 * @params 请求参数
 * @successFunction 成功的回调方法
 * @failFunction 失败的回调方法
 * @isShowLoading 是否显示等待框（默认显示）
 */
const doApi = (url, param, successFunction, failFunction, isShowLoading = true) => {
  if (isShowLoading) {
    wx.showLoading({
      title: '加载中......'
    })
  }

  //获取openid
  let openid = wx.getStorageSync('openid')
  //获取手机型号
  let device = wx.getStorageSync('device')
  //获取微信版本号
  let wxversion = wx.getStorageSync('wxversion')
  //获取时间
  let timeM = new Date()
  let timeParam = timeM.getTime()
  //sign
  let sign = md5.hexMD5(encodeURIComponent(param) + signKey + timeParam)
  //参数值
  let paramData = Encrypt(encodeURIComponent(param))

  let params = {
    "source": 2,
    "token": openid,
    "sign": sign,
    "data": paramData,
    "deviceId": '',
    "time": timeParam,
    "version": version,
    "brandName": device,
    "other": wxversion
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
          if (typeof failFunction == "function") {
            failFunction(res);
          } else {
            showToast(res.data.respMsg)
          }
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
 * 请求api
 * @url 请求地址
 * @params 请求参数
 * @successFunction 成功的回调方法
 * @failFunction 失败的回调方法
 */
const doUpload = (url, filePath, param, successFunction, failFunction) => {
  //获取openid
  let openid = wx.getStorageSync('openid')
  //获取手机型号
  let device = wx.getStorageSync('device')

  param["source"] = 2
  param["token"] = openid
  param["deviceId"] = device

  wx.uploadFile({
    url: baseUrl + apiFileUpload,
    filePath: filePath,
    name: 'file',
    formData: param,
    success: function(res) {
      if (typeof successFunction == "function") {
        successFunction(res)
      }
    },
    fail: function(res) {
      if (typeof failFunction == "function") {
        failFunction(res)
      }
    },
    complete: function(res) {}
  })
}

//授权----------------------------------------------------------------------------
const hardwareAuth = (title, content) => {
  // 获取用户信息
  wx.getSetting({
    success: res => {
      wx.showModal({
        title: title,
        content: content,
        success: function(res) {
          if (res.cancel) {
            wx.showToast({
              title: '拒绝授权',
              icon: 'none',
              duration: 1000
            })
          } else if (res.confirm) {
            wx.openSetting({
              success: function(dataAu) {
                if (dataAu.authSetting["scope.userLocation"] == true) {
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                    duration: 1000
                  })
                  //再次授权，调用wx.getLocation的API

                } else {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'none',
                    duration: 1000
                  })
                }
              }
            })
          }
        }
      })
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

  var oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
  // 将密文转为Base64的字符串
  var base64Str = CryptoJS.enc.Base64.stringify(oldHexStr);

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
 * 判断是否是闰年
 */
const isLeapYear = year => {
  return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)
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

/**
 * 显示确认框
 * @param content 显示内容
 * @param okCallback 确认回调方法
 */
const showConfirm = (content, okCallback) => {
  wx.showModal({
    title: '提示',
    content: content,
    success: function(sm) {
      if (sm.confirm) {
        if (typeof okCallback == "function") {
          okCallback()
        }
      }
    }
  })
}

//模块导出部分-----------------------------------------------------------------------
module.exports = {
  QQKey: QQKey,
  baseUrl: baseUrl,
  apiLogin: apiLogin,
  apiSendSms: apiSendSms,
  apiMessage: apiMessage,
  apiConfig: apiConfig,
  apiMe: apiMe,
  apiTaskList: apiTaskList,
  apiTaskUpdate: apiTaskUpdate,
  apiTaskDetail: apiTaskDetail,
  apiFileUpload: apiFileUpload,
  apiGpsSave: apiGpsSave,
  apiDelFile: apiDelFile,
  apiGetOpenid: apiGetOpenid,
  isEmpty: isEmpty,
  isLeapYear: isLeapYear,
  showToast: showToast,
  showConfirm: showConfirm,
  doApi: doApi,
  doUpload: doUpload,
  hardwareAuth: hardwareAuth
}