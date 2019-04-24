//导入通用方法js
const util = require('../../utils/util.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    'mobileno': '',
    'smscode': '',
    'countdown': 40,
    'countdownText': '获取验证码',
    'cansend':true
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
  },
  failLogin: function(res) {
  },
  /**
   * 发送验证码
   */
  sendSms: function() {
    if (!this.data.cansend) {
      return false
    }

    this.setData({
      cansend:false
    })

    if (util.isEmpty(this.data.mobileno)) {
      util.showToast('请输入手机号！')
    } else {
      let countdown = 40
      let countdownText = '重新获取' + countdown + 'S'
      this.setData({
        countdown: countdown,
        countdownText: countdownText
      })

      let cansend = false
      let id = setInterval(() => {
        if (countdown > 1) {
          countdown--
          countdownText = '重新获取' + countdown + 'S'
        } else {
          clearInterval(id)
          countdownText = '获取验证码'
          cansend = true
        }

        this.setData({
          countdown: countdown,
          countdownText: countdownText,
          cansend: cansend
        })
      }, 1000)      

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