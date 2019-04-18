// pages/task/installlocation/installlocation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 点击项目
   */
  checkItem: function(e) {
    console.log(e)

    //点击的序号
    let selectedIndex = e.currentTarget.dataset.index

    //选中/取消
    let changed = this.data.items[selectedIndex] == 0 ? 1 : 0

    let arr = [];

    //重置数组
    for (let i = 0; i < this.data.items.length; i++) {
      if (i == selectedIndex) {
        arr.push(changed)
      } else {
        arr.push(0)
      }
    }

    //绑定新数组
    this.setData({
      items: arr
    })
  }
})