// pages/task/teardowndevice/teardowndevice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      data1:false,
      data2:false,
      data3: false,
      data4: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  test1:function(e){
    this.setData({
      data1:!this.data.data1
    })
  },
  test2: function (e) {
    this.setData({
      data2: !this.data.data2
    })
  },
  test3: function (e) {
    this.setData({
      data3: !this.data.data3
    })
  },
  test4: function (e) {
    this.setData({
      data4: !this.data.data4
    })
  }
})