//导入通用方法js
const util = require('../../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    src1_1: '/imgs/cammera.png',
    src1_2: '/imgs/cammera.png',
    src1_3: '/imgs/cammera.png',
    srcArrFix1: ['/imgs/cammera.png', '/imgs/cammera.png', '/imgs/cammera.png', '/imgs/jia.png'],
    currentIndex1: -1,
    locationId: '',
    locationName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.ctx = wx.createCameraContext()


    let dataString = '{}'
    util.doApi(util.apiConfig, dataString, this.successConfig)

    //let dataString = '{"id":"8a81a01166280653016628194e690002"}'
    //util.doApi('/api/gps/workOrderInfo.do', dataString, this.successConfig)

    //let dataString = '{"aspzt":"1,2,3,5,6"}'
    //util.doApi('/api/erp/workOrderList.do',dataString,this.successConfig)

    /*let a = '8a81a01166280653016628194e690002'
    let b = '0'
    let c = 'abc'
    let dataString = '{"asqid":"' + a + '","astatus":"' + b + '","acjbz":"' + c + '"}'
    util.doApi('/api/erp/updateOrderStatus.do',dataString,this.successConfig)*/

    //let dataString = '{"date":"2019-03"}'
    //util.doApi('/api/gps/queryReport.do',dataString,this.successConfig)
  },

  onShow: function(options) {
    this.setData({
      locationId: getApp().globalData.locationId,
      locationName: getApp().globalData.locationName
    })
  },

  successConfig: function(res) {



  },
  /**
   * 显示照相机
   */
  showCamera: function(e) {
    let index = e.currentTarget.dataset.id
    this.setData({
      currentIndex1: index
    })

    if (this.data.srcArrFix1[index] == '/imgs/cammera.png' || this.data.srcArrFix1[index] == '/imgs/jia.png') {
      this.setData({
        isShow: true
      })
    } else {
      wx.previewImage({
        current: [this.data.srcArrFix1[index]], //当前图片地址
        urls: [this.data.srcArrFix1[index]], //所有要预览的图片的地址集合 数组形式
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  /**
   * 隐藏照相机
   */
  hiddeCarema: function() {
    this.setData({
      isShow: false
    })
  },
  /**
   * 拍照
   */
  takePhoto: function() {
    let that = this

    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        that.data.srcArrFix1[that.data.currentIndex1] = res.tempImagePath

        if (that.data.currentIndex1 > 2 && that.data.currentIndex1 < 7) {
          that.data.srcArrFix1.push('/imgs/jia.png')
        }

        this.setData({
          srcArrFix1: that.data.srcArrFix1,
          isShow: false
        })
      }
    })
  },
  /**
   * 删除图片
   */
  deletePhoto: function(e) {
    let that = this

    wx.showModal({
      title: '提示',
      content: '确认删除这张照片？',
      success(res) {
        if (res.confirm) {

          if (e.currentTarget.dataset.id < 3) {
            that.data.srcArrFix1[e.currentTarget.dataset.id] = '/imgs/cammera.png'
          } else {
            that.data.srcArrFix1.splice(e.currentTarget.dataset.id, 1)
            that.data.srcArrFix1.push('/imgs/jia.png')
          }

          that.setData({
            srcArrFix1: that.data.srcArrFix1
          })
        }
      }
    })
  },

  gotoLocation: function() {
    /*wx.redirectTo({
      url: '/pages/task/installlocation/installlocation'
    })*/
    wx.navigateTo({
      url: '/pages/task/installlocation/installlocation'
    })
  }
})