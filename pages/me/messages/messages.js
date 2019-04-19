//导入通用方法js
const util = require('../../../utils/util.js')

Page({
  data: {
  },
  //事件处理函数
  bindViewTap: function () {
  },
  onLoad: function (options) {
    console.log(options)

    let dataJson = {}
    let dataString = '{}'

    util.doApi('/api/gps/config.do', dataString, this.successMessage)
  },
  successMessage:function(res){

  },
  test:function(){
    wx.redirectTo({
      url: '/pages/me/me?b=2'
    })
  }
})
