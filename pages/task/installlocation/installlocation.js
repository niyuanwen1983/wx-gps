// pages/task/installlocation/installlocation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    modalHidden: true
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
  },

  showModalHtml: function() {
    /*this.setData({
      modalHidden: false
    })*/

    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: ['https://zfduatappfilesever.zhifubank.com.cn/ErpAttachedPic/%5c%e5%ae%9e%e5%9c%b0%e5%8d%95%5c%5cspot00003001/ed1eba98-9dd4-4e2a-8ee9-a5a961fa8b0c', 'https://zfduatappfilesever.zhifubank.com.cn/ErpAttachedPic/%5c%e5%ae%9e%e5%9c%b0%e5%8d%95%5c%5cspot00003001/ed1eba98-9dd4-4e2a-8ee9-a5a961fa8b0c'] // 需要预览的图片http链接列表
    })
  },
  modalConfirm: function() {
    this.setData({
      modalHidden: true
    })
  },
  modalCandel: function() {
    this.setData({
      modalHidden: true
    })
  }
})