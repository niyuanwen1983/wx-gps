var template = require('../../template/template.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    currentTab:0
  },
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {
    template.tabbar("tabBar", 1, this)
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  }
})