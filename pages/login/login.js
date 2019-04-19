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
    if (util.isEmpty(this.data.mobileno)) {
      util.showToast('请输入手机号！')
    } else if (util.isEmpty(this.data.smscode)) {
      util.showToast('请输入验证码！')
    } else {
      let dataJson = {
        "mobile": this.data.mobileno,
        "smsCode": this.data.smscode
      }
      let dataString = '{"mobile":"' + this.data.mobileno + '","smsCode":"' + this.data.smscode + '"}'

      util.doApi(util.apiLogin, dataString, this.successLogin, this.failLogin)
    }
  },
  /**
   * 登录成功回调方法
   */
  successLogin: function(res) {
    console.log(res)
  },
  failLogin: function(res) {
    console.log(res)
  },
  /**
   * 发送验证码
   */
  sendSms: function() {
    if (util.isEmpty(this.data.mobileno)) {
      util.showToast('请输入手机号！')
    } else {
      let dataJson = {
        "mobile": this.data.mobileno
      }
      let dataString = '{"mobile":"' + this.data.mobileno + '"}'

      util.doApi(util.apiSendSms, dataString, this.successSendSms)
    }
  },
  /**
   * 发送验证码成功回调方法
   */
  successSendSms: function(res) {
    util.showToast('验证码已发送！')
  }
})