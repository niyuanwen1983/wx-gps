//导入通用方法js
const util = require('../../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true,
    locationArr: [],
    checkedItem: '',
    locationIndex: 0,
    selectedCode: '', //详情页面传入
    emptyImage: util.baseUrl + '/images/gps/0.jpg' //空图
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      locationIndex: options.index,
      selectedCode: options.code
    })

    let dataString = '{}'
    util.doApi(util.apiConfig, dataString, this.successConfig)
  },

  successConfig: function(res) {
    let tempArr = res.data.respData.instLocs

    let checkedIndex = -1
    for (let i = 0; i < tempArr.length; i++) {
      tempArr[i].imageUrl = util.baseUrl + tempArr[i].imageUrl
      if (tempArr[i].code == this.data.selectedCode) {
        tempArr[i].selected = 1
        checkedIndex = i
      }
    }

    this.setData({
      locationArr: tempArr
    })

    if (checkedIndex > -1) {
      this.setData({
        checkedItem: tempArr[checkedIndex]
      })
    }
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
    if (util.isEmpty(this.data.checkedItem.code)) {
      util.showToast('请选择安装位置！')
    } else {
      let that = this

      getApp().globalData.locationIndex = this.data.locationIndex
      getApp().globalData.locationId = this.data.checkedItem.code
      getApp().globalData.locationName = this.data.checkedItem.name

      wx.showModal({
        title: '提示',
        content: '确定选择该位置进行安装？',
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
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