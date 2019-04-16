//login.js
//导入通用方法js
const util = require('../../utils/util.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    'mobileno': '',
    'smscode': ''
  },
  onLoad: function() {
  },
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
      util.doApi(util.api1, {},this.successLogin, this.failLogin)
    }
  },
  successLogin: function(res) {
    console.log(res)
  },
  failLogin: function(res) {
    console.log(res)
  }
})