//index.js
//获取应用实例
//const app = getApp()

var template = require('../../template/template.js');

Page({
  data: {},
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {
    template.tabbar("tabBar", 2, this)
  },
  getUserInfo: function(e) {},
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
  gotoMessages: function () {
    wx.navigateTo({
      url: '/pages/me/messages/messages?a=1'
    })
  },
  /**
   * 跳转到待收入页面
   */
  gotoMyincome: function () {
    wx.navigateTo({
      url: '/pages/me/myincome/myincome'
    })
  }
})