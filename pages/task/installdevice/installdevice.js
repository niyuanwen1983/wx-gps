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
    src1_1: '/imgs/cammera.png',
    src1_2: '/imgs/cammera.png',
    src1_3: '/imgs/cammera.png',
    srcArrFix1: ['/imgs/cammera.png', '/imgs/cammera.png', '/imgs/cammera.png', '/imgs/jia.png'],
    srcArrFixBase64: ['', '', '', ''],
    currentIndex1: -1,
    locationId: '',
    locationName: '',
    gpsLocation: '',

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
    asfxx: [] //设备列表
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
      quality: 'low',
      success: (res) => {
        that.data.srcArrFix1[that.data.currentIndex1] = res.tempImagePath

        if (that.data.currentIndex1 > 2 && that.data.currentIndex1 < 7) {
          that.data.srcArrFix1.push('/imgs/jia.png')
        }

        this.setData({
          srcArrFix1: that.data.srcArrFix1,
          isShow: false
        })

        wx.showLoading({
          title: '加载中......',
        })

        //let dataString = '{"id":"8a82cc9d65ccc8130165ccccdeb20044","asqlx":"1","atplx":"1001"}'
        let dataString = {
          "id": "8a82cc9d65ccc8130165ccccdeb20044", 
          "asqlx": "1", 
          "atplx": "1001"
        }

        util.doUpload(util.apiFileUpload, res.tempImagePath, dataString, that.successFileUpload, that.failFileUpload)

        /*wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.data.srcArrFixBase64[0] = res.data

            let dataString = '{"id":"8a82c8a6679b6fc401679bee68b5001d","asqlx":"1","atplx":"1001","dimageData":"' + that.data.srcArrFixBase64[0] + '","fileName":"abcd.jpg","fileSuffix":"jpg"}'

            util.doApi(util.apiFileUpload, dataString, that.successFileUpload, that.failFileUpload)
          }
        })*/
      }
    })
  },

  successFileUpload: function(res) {
    console.log(res)
  },

  failFileUpload: function() {
    console.log('上传失败！')
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
  /**
   * 跳转到安装位置选择画面
   */
  gotoLocation: function(e) {
    /*wx.redirectTo({
      url: '/pages/task/installlocation/installlocation'
    })*/
    wx.navigateTo({
      url: '/pages/task/installlocation/installlocation?index=' + e.currentTarget.dataset.index
    })
  },
  /**
   * 提交
   */
  firstCommit: function() {
    //let dataString = '{"aspzt":"' + this.data.aspzt + '"}'
    //id 申请单id "8a82c8a6679b6fc401679bee68b5001d"
    //asqlx 申请类型 1 安装申请 2 悔贷拆机申请
    //atplx 图片类型 1001 安装位置 1002 人车合影 1003 设备车架号合影 1004 其他 1005 拆机图片
    //dimageData 图片内

    /*let that = this

    wx.showLoading({
      title: '加载中......',
    })

    wx.getFileSystemManager().readFile({
      filePath: that.data.srcArrFix1[0], //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        //console.log('data:image/png;base64,' + res.data)
        that.data.srcArrFixBase64[0] = 'data:image/jpg;base64,' + res.data
        that.setData({
          srcArrFixBase64: that.data.srcArrFixBase64
        })

        let dataString = '{"id":"8a82c8a6679b6fc401679bee68b5001d","asqlx":"1","atplx":"1001","dimageData":"' + that.data.srcArrFixBase64[0] + '","fileName":"a","fileSuffix":"jpg"}'

        util.doApi(util.apiFileUpload, dataString, that.successFileUpload)
      }
    })*/

    let dataString = '{"id":"8a82c8a6679b6fc401679bee68b5001d","asqlx":"1","aazwz":"1001"}'

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
   * 提交成功回调方法
   * @param res 返回结果
   */
  failGpsSave: function(res) {
    util.showToast('提交失败！')

    //返回到工单首页
    wx.navigateBack({
      delta: 2
    })
  }
})