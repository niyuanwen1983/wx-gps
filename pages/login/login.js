//login.js
const md5 = require('../../assets/js/md5/md5.js')
const CryptoJS = require('../../assets/js/aes/aes.js')
const base64 = require('../../assets/js/base64/base64.js')

//导入通用方法js
const util = require('../../utils/util.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    'mobileno': '',
    'smscode': ''
  },
  onLoad: function() {},
  //获取用户输入的手机号
  mobilenoInput: function(e) {
    this.setData({
      mobileno: e.detail.value
    })
  },
  //获取用户输入的验证码
  smscodeInput: function(e) {
    this.setData({
      smscode: e.detail.value
    })
  },
  login: function() {
    let obj = wx.getStorageSync('user');
    if (util.isEmpty(this.data.mobileno)) {
      util.showToast('请输入手机号！')
    } else if (util.isEmpty(this.data.smscode)) {
      util.showToast('请输入验证码！')
    } else {
      /*let params = {
        'mobile': this.data.mobileno,
        'smsCode': this.data.smscode
      }*/
      let timeM = new Date()

      let dataJson = {
        "mobile": this.data.mobileno,
        "smsCode": this.data.smscode
      }
      let dataString = '{"mobile":"' + this.data.mobileno + '","smsCode":"' + this.data.smscode + '"}'

      let sign = md5.hexMD5(dataString + util.signKey + timeM.getTime())

      var paramData = util.Encrypt(dataString)

      let params = {
        "source": 2,
        "token": obj.openid,
        "sign": sign,
        "data": paramData,
        "deviceId": "",
        "time": timeM.getTime()
      }      

      util.doApi(util.apiLogin, params, this.successLogin, this.failLogin)
    }
  },
  successLogin: function(res) {
    console.log(res)
  },
  failLogin: function(res) {
    console.log(res)
  },

  sendSms:function(){
    let obj = wx.getStorageSync('user');
    util.showToast('验证码已发送！')

    let timeM = new Date()

    let dataJson = {
      "mobile": this.data.mobileno
    }
    let dataString = '{"mobile":"' + this.data.mobileno + '"}'

    let sign = md5.hexMD5(dataString + util.signKey + timeM.getTime())

    var paramData = util.Encrypt(dataString)

    let params = {
      "source": 2,
      "token": obj.openid,
      "sign": sign,
      "data": paramData,
      "deviceId": "",
      "time": timeM.getTime()
    }

    util.doApi('/api/gps/sendSms.do', params, this.successLogin, this.failLogin)
  }
})