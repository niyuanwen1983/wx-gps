//导入通用方法js
const util = require('../../../utils/util.js')

Page({
  data: {
    messageArr:[]
  },
  //事件处理函数
  bindViewTap: function () {
  },
  onLoad: function (options) {
    let dataJson = {}
    let dataString = '{}'

    //util.doApiMock('https://www.easy-mock.com/mock/5c6c15b5ab815c130b4720c7/example/gpsmessage', dataString, this.successMessage)
    util.doApi(util.apiMessage, dataString, this.successMessage)
  },
  successMessage:function(res){
    this.setData({
      messageArr: res.data.respData
    })
  },
  test:function(){
    wx.redirectTo({
      url: '/pages/me/me?b=2'
    })
  }
})
