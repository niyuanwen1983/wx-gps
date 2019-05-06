//导入通用方法js
const util = require('../../../utils/util.js')

// 引入SDK核心类
var QQMapWX = require('../../../assets/js/qqmap/qqmap-wx-jssdk.js')
var qqmapsdk

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    currentIndex1: -1,
    locationId: '',
    locationName: '',
    gpsLocation: '',

    tapIndex: -1,
    tapIdx: -1,

    selectedLocationId: [], //安装位置id
    selectedLocationValue: [], //安装位置名称

    axm: '', //姓名
    acp: '', //车牌号码
    acjh: '', //车架号
    tsqsj: '', //发起时间
    dqwazsj: '', //期望安装时间
    aazsj: '', //安装时间
    aazdz: '', //安装地址
    afjxx: [], //附件信息
    asfxx: [], //设备列表

    photoArr: [] //照片数组
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.ctx = wx.createCameraContext()

    //this.initData(options.id)
    //todo
    this.initData('1556267499660-239f')

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: util.QQKey
    });
  },

  onShow: function(options) {
    let that = this

    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {

          },
          fail: function(res) {
            wx.showToast({
              title: 'gps定位失败！'
            })
            console.log(res)
          },
          complete: function(res) {
            console.log(res)
            that.setData({
              gpsLocation: res.result.address
            })
          }
        })
      }
    })
    if (!util.isEmpty(getApp().globalData.locationId) && !util.isEmpty(getApp().globalData.locationName)) {
      let tempIdArr = this.data.selectedLocationId
      tempIdArr[getApp().globalData.locationIndex] = getApp().globalData.locationId
      let tempValueArr = this.data.selectedLocationValue
      tempValueArr[getApp().globalData.locationIndex] = getApp().globalData.locationName

      this.setData({
        locationId: getApp().globalData.locationId,
        locationName: getApp().globalData.locationName,
        selectedLocationId: tempIdArr,
        selectedLocationValue: tempValueArr
      })
    }
  },
  /**
   * 初始化
   * @param id 工单id
   */
  initData: function(id) {
    let dataString = '{"id":"' + id + '"}'
    util.doApi(util.apiTaskDetail, dataString, this.initDataSuccess)
  },
  /**
   * 初始化回调方法
   * @param res 返回结果
   */
  initDataSuccess: function(res) {
    console.log(res)

    this.setData({
      axm: res.data.respData.axm,
      acp: res.data.respData.acp,
      acjh: res.data.respData.acjh,
      tsqsj: res.data.respData.tsqsj,
      dqwazsj: res.data.respData.dqwazsj,
      aazdz: res.data.respData.aazdz,
      afjxx: res.data.respData.afjxx,
      asfxx: res.data.respData.asfxx
    })

    var selectedLocationIdTemp = []
    var selectedLocationValueTemp = []
    for (let i = 0; i < res.data.respData.asfxx.length; i++) {
      selectedLocationIdTemp.push('')
      selectedLocationValueTemp.push('')
    }
    this.setData({
      selectedLocationId: selectedLocationIdTemp,
      selectedLocationValue: selectedLocationValueTemp
    })

    //初始化照片数组
    let photoArrTemp = []
    for (let ii = 0; ii < res.data.respData.asfxx.length; ii++) {
      let photos = ['/imgs/cammera.png', '/imgs/cammera.png', '/imgs/cammera.png', '/imgs/jia.png']
      for (let j = 0; j < res.data.respData.asfxx[ii].aazzp.length; j++) {
        if (j <= 3) {
          if (res.data.respData.asfxx[ii].aazzp[j].afjxl == '1001') {
            photos[0] = res.data.respData.asfxx[ii].aazzp[j].imageUrl
          } else if (res.data.respData.asfxx[ii].aazzp[j].afjxl == '1002') {
            photos[1] = res.data.respData.asfxx[ii].aazzp[j].imageUrl
          } else if (res.data.respData.asfxx[ii].aazzp[j].afjxl == '1003') {
            photos[2] = res.data.respData.asfxx[ii].aazzp[j].imageUrl
          } else {
            photos[3] = res.data.respData.asfxx[ii].aazzp[j].imageUrl
          }
        } else {
          photos.push(res.data.respData.asfxx[ii].aazzp[j].imageUrl)
        }
      }
      if (photos.length > 3 && photos.length < 8 && photos[photos.length - 1] != '/imgs/jia.png') {
        photos.push('/imgs/jia.png')
      }
      photoArrTemp.push(photos)
    }

    this.setData({
      photoArr: photoArrTemp
    })
  },
  /**
   * 放大显示附件图片
   */
  prevImage: function(e) {
    wx.previewImage({
      current: [e.currentTarget.dataset.url], //当前图片地址
      urls: [e.currentTarget.dataset.url], //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 显示照相机
   */
  showCamera: function(e) {
    let index = e.currentTarget.dataset.id
    let idx = e.currentTarget.dataset.idx
    this.setData({
      currentIndex1: index,
      tapIndex: index,
      tapIdx: idx
    })

    if (this.data.photoArr[index][idx] == '/imgs/cammera.png' || this.data.photoArr[index][idx] == '/imgs/jia.png') {
      this.setData({
        isShow: true
      })
    } else {
      wx.previewImage({
        current: [this.data.photoArr[index][idx]], //当前图片地址
        urls: [this.data.photoArr[index][idx]], //所有要预览的图片的地址集合 数组形式
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
        that.data.photoArr[that.data.tapIndex][that.data.tapIdx] = res.tempImagePath

        if (that.data.tapIndex > 2 && that.data.tapIndex < 7) {
          that.data.photoArr[that.data.tapIndex].push('/imgs/jia.png')
        }

        this.setData({
          photoArr: that.data.photoArr,
          isShow: false
        })

        let atplx = '1004'
        if (that.data.tapIdx == 0) {
          atplx = '1001'
        } else if (that.data.tapIdx == 1) {
          atplx = '1002'
        } else if (that.data.tapIdx == 2) {
          atplx = '1003'
        }

        let id = that.data.asfxx[that.data.tapIndex].id

        let dataString = {
          "id": id,
          "asqlx": "1",
          "atplx": atplx
        }

        util.doUpload(util.apiFileUpload, res.tempImagePath, dataString, that.successFileUpload, that.failFileUpload)
      }
    })
  },
  /**
   * 图片上传成功回调方法
   * @param res 返回结果
   */
  successFileUpload: function(res) {
    console.log(res)
    util.showToast('照片上传成功！')
    this.initData('1556267499660-239f')
  },
  /**
   * 图片上传失败回调方法
   * @param res 返回结果
   */
  failFileUpload: function() {
    console.log('上传失败！')
    util.showToast('照片上传失败！')
  },
  /**
   * 删除图片
   */
  deletePhoto: function(e) {
    let that = this

    let id = ''
    for (let i = 0; i < that.data.asfxx.length; i++) {
      for (let j = 0; j < that.data.asfxx[i].aazzp.length; j++) {
        if (that.data.asfxx[i].aazzp[j].imageUrl == e.currentTarget.dataset.imgid) {
          id = that.data.asfxx[i].aazzp[j].id
          break
        }
      }
    }

    wx.showModal({
      title: '提示',
      content: '确认删除这张照片？',
      success(res) {
        if (res.confirm) {
          if (util.isEmpty(id)) {

          } else {
            let dataString = '{"id":"' + id + '"}'
            util.doApi(util.apiDelFile, dataString, that.deleteSuccess)
          }
        }
      }
    })
  },
  /**
   * 删除照片成功回调方法
   * @param res 返回结果
   */
  deleteSuccess: function(res) {
    util.showToast('删除成功！')

    this.initData('1556267499660-239f')
  },
  /**
   * 跳转到安装位置选择画面
   */
  gotoLocation: function(e) {
    wx.navigateTo({
      url: '/pages/task/installlocation/installlocation?index=' + e.currentTarget.dataset.index
    })
  },
  /**
   * 提交
   */
  firstCommit: function() {
    /*asqid 申请id

    asqlx 申请类型 1 安装申请 2 悔贷拆机申请(必填)

    aazdz 安装地址 / 拆机备注

    gpslist gps设备更新（集合）

    --> gpsid gps设备id

    --> acjqk 拆机情况 1001 拆机成功 1002 拆机失败

    --> aazwz 安装位置(参考配置接口安装位置)*/

    let temp = '['
    for (let i = 0; i < this.data.asfxx.length; i++) {
      temp += '{"gpsid":"' + this.data.asfxx[i].id + '","aazwz":"' + this.data.selectedLocationId[i] + '"},'
    }
    temp = temp.substr(0, temp.length - 1)
    temp += ']'

    let dataString = '{"asqid":"1556267499660-239f","asqlx":"1","aazdz":"' + this.data.gpsLocation + '","gpslist":' + temp + '}'

    util.doApi(util.apiGpsSave, dataString, this.successGpsSave, this.failGpsSave)
  },
  /**
   * 提交成功回调方法
   * @param res 返回结果
   */
  successGpsSave: function(res) {
    util.showToast('提交成功！')

    wx.navigateBack({
      delta: 2
    })
  },
  /**
   * 提交失败回调方法
   * @param res 返回结果
   */
  failGpsSave: function(res) {
    util.showToast('提交失败！')
  }
})