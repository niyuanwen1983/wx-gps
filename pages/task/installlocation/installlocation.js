//导入通用方法js
const util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true,
    locationArr: [],
    checkedItem: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let dataString = '{}'
    util.doApi(util.apiConfig, dataString, this.successConfig)
  },


  successConfig: function(res) {

    this.setData({
      locationArr: res.data.respData.instLocs
    })
  },
  /**
   * 点击项目
   */
  checkItem: function(e) {

    //点击的序号
    let selectedIndex = e.currentTarget.dataset.index

    this.setData({
      checkedItem: this.data.locationArr[selectedIndex]
    })

    //选中/取消
    let changed = this.data.locationArr[selectedIndex].selected == 0 ? 1 : 0

    let arr = [];

    //重置数组
    for (let i = 0; i < this.data.locationArr.length; i++) {
      let obj = {
        'code': this.data.locationArr[i].code,
        'name': this.data.locationArr[i].name,
        'imageUrl': this.data.locationArr[i].imageUrl,
        'selected': 0
      }
      if (i == selectedIndex) {
        obj.selected = 1
      }

      arr.push(obj)
    }

    //绑定新数组
    this.setData({
      locationArr: arr
    })
  },

  showModalHtml: function() {
    let that = this

    getApp().globalData.locationId = this.data.checkedItem.code
    getApp().globalData.locationName = this.data.checkedItem.name

    wx.showModal({
      title: '提示',
      content: '确定选择该位置进行安装？',
      success: function() {
        wx.navigateBack({
          delta:1
        })
      }
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