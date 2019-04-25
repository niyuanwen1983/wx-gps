//导入通用方法js
const util = require('../../utils/util.js')

var template = require('../../template/template.js')

Page({
  data: {},
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {
    template.tabbar("tabBar", 2, this)

    let currentYearMonth = new Date()
    let dateParam = currentYearMonth.getFullYear() + '-' + (currentYearMonth.getMonth() + 1 >= 10 ? currentYearMonth.getMonth() + 1 : '0' + (currentYearMonth.getMonth() + 1))
    let dataJson = {
      "date": currentYearMonth.getFullYear() + '-' + (currentYearMonth.getMonth() + 1 < 10 ? currentYearMonth.getMonth() + 1 : '0' + (currentYearMonth.getMonth() + 1))
    }
    let dataString = '{"date":"' + dateParam + '"}'

    util.doApi(util.apiMe, dataString, this.successMe)
  },

  successMe: function(res) {
    console.log(res)
  },
  /**
   * 跳转到待收入页面
   */
  gotoIncome: function() {
    /*wx.navigateTo({
      url: '/pages/income/income'
    })*/
    wx.redirectTo({
      url: '/pages/income/income'
    })
  },
  /**
   * 跳转到待消息中心页面
   */
  gotoMessages: function() {
    wx.navigateTo({
      url: '/pages/me/messages/messages?a=1'
    })
  },
  /**
   * 跳转到待收入页面
   */
  gotoMyincome: function() {
    wx.navigateTo({
      url: '/pages/me/myincome/myincome'
    })
  }
})