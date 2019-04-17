//获取应用实例
const app = getApp()

Page({
  data: {
    date: '2019-04',
  },
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {
    //设置当前年月
    let current = new Date()
    current = current.getFullYear() + '-' + ((current.getMonth() + 1) < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1)
    this.setData({
      date: current
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  }
})