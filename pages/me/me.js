//index.js
//获取应用实例
const app = getApp()

var template = require('../../template/template.js');

Page({
  data: {
  },
  //事件处理函数
  bindViewTap: function () {
  },
  onLoad: function () {
    template.tabbar("tabBar", 2, this)
  },
  getUserInfo: function (e) {
  }
})
