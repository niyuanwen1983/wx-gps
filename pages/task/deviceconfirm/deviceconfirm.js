//获取应用实例
const app = getApp()

Page({
  data: {},
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {},

  /**
   * 跳转到工单详情页面
   */
  gotoDetail: function(e) {
    wx.navigateTo({
      url: '/pages/task/installdevice/installdevice?id=' + e.currentTarget.dataset.id
    })
  },
  backToTask: function(e) {
    wx.navigateBack()
  }
})