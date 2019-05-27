//导入通用方法js
const util = require('../../../utils/util.js')

// 引入SDK核心类
let QQMapWX = require('../../../assets/js/qqmap/qqmap-wx-jssdk.js')
let qqmapsdk

Page({
  /**
   * 页面的初始数据
   */
  data: {
    frontBack: true, //摄像头（默认为后置）
    isInit: true,
    id: '',
    isShow: false,
    currentIndex1: -1,
    locationId: '',
    locationName: '',
    gpsLocation: '',

    tapIndex: -1, //点击图片的设备序号
    tapIdx: -1, //点击图片的序号

    selectedLocationId: [], //安装位置id
    selectedLocationValue: [], //安装位置名称

    axm: '', //姓名
    acp: '', //车牌号码
    acjh: '', //车架号
    tsqsj: '', //发起时间
    dqwazsj: '', //期望安装时间
    dazsj: '', //安装时间
    aazdz: '', //安装地址
    athyy: '', //退回原因
    afjxx: [], //附件信息
    asfxx: [], //设备列表
    aazwz: [], //安装位置

    photoArr: [], //照片数组

    currentStatus: 0, //状态（0：不可修改；1可修改）todo

    modalHidden: true, //安装位置是否显示
    locationArr: [], //安装位置图片数组
    currentLocationImg: '', //选中的安装位置图片（用于查看安装位置）

    scroll_top: 0, //距离顶部位置（关闭照相机后，需要定位到该位置）

    obj: null //详情对象（用于上传/删除图片后，更新图片信息）
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.ctx = wx.createCameraContext()

    this.setData({
      id: options.id,
      currentStatus: options.status == 0 ? 0 : 1
    })

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: util.QQKey
    })
  },
  /**
   * 获取安装图片成功回调方法
   * @param res 返回结果
   */
  successConfig: function(res) {
    this.setData({
      locationArr: res.data.respData.instLocs
    })

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
            that.setData({
              gpsLocation: res.result.address
            })
          },
          fail: function(res) {
            wx.showToast({
              title: 'gps定位失败！'
            })
          },
          complete: function(res) {
            that.setData({
              gpsLocation: res.result.address
            })
          }
        })
      },
      fail: function(e) {
        util.hardwareAuth('授权当前位置', '需要获取您的地理位置，请确认授权')
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

      getApp().globalData.localTempIdArr = tempIdArr
      getApp().globalData.localTempValueArr = tempValueArr
    }

    //如果是从确认画面进入
    if (util.isEmpty(getApp().globalData.locationId)) {
      this.initData(this.data.id)
    } else { //从选择安装位置画面返回
      getApp().globalData.locationId = ''
    }
  },

  onShow: function(options) {
    //获取安装位置图片
    let dataString = '{}'
    util.doApi(util.apiConfig, dataString, this.successConfig, undefined, false)
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
    this.setData({
      axm: res.data.respData.axm,
      acp: res.data.respData.acp,
      acjh: res.data.respData.acjh,
      tsqsj: res.data.respData.tsqsj,
      dqwazsj: res.data.respData.dqwazsj,
      dazsj: res.data.respData.dazsj,
      aazdz: res.data.respData.aazdz,
      athyy: res.data.respData.athyy,
      afjxx: res.data.respData.afjxx,
      asfxx: res.data.respData.asfxx,
      obj: res.data.respData
    })

    //安装位置只初始化一次
    if (this.data.isInit) {
      let selectedLocationIdTemp = []
      let selectedLocationValueTemp = []
      for (let i = 0; i < res.data.respData.asfxx.length; i++) {
        //是否有安装位置
        if (util.isEmpty(res.data.respData.asfxx[i].aazwz)) { //没有安装位置
          selectedLocationIdTemp.push('')
          selectedLocationValueTemp.push('')
        } else { //有安装位置
          selectedLocationIdTemp.push(res.data.respData.asfxx[i].aazwz)
          for (let j = 0; j < this.data.locationArr.length; j++) {
            if (this.data.locationArr[j].code == res.data.respData.asfxx[i].aazwz) {
              selectedLocationValueTemp.push(this.data.locationArr[j].name)
              break
            }
          }
        }
      }
      this.setData({
        selectedLocationId: selectedLocationIdTemp,
        selectedLocationValue: selectedLocationValueTemp
      })
    }

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
      if (photos.length > 3 && photos.length < 8 && photos[photos.length - 1] != '/imgs/jia.png' && this.data.currentStatus == 1) {
        photos.push('/imgs/jia.png')
      }
      photoArrTemp.push(photos)
    }

    this.setData({
      isInit: false,
      photoArr: photoArrTemp
    })
  },
  /**
   * 初始化
   * @param id 工单id
   */
  initPhoto: function(id) {
    let dataString = '{"id":"' + id + '"}'
    util.doApi(util.apiTaskDetail, dataString, this.initPhotoSuccess)
  },
  initPhotoSuccess: function(res) {
    this.setData({
      obj: res.data.respData
    })
  },
  /**
   * 放大显示附件图片
   */
  prevImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, //当前图片地址
      urls: this.data.afjxx, //所有要预览的图片的地址集合 数组形式
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
      //过滤掉占位图片
      let tempArr = this.data.photoArr[index].filter((item) => {
        return item != '/imgs/cammera.png' && item != '/imgs/jia.png'
      })

      wx.previewImage({
        current: this.data.photoArr[index][idx], //当前图片地址
        urls: tempArr, //所有要预览的图片的地址集合 数组形式
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

    let that = this
    wx.pageScrollTo({
      //scrollTop: that.data.scroll_top,
      scrollTop: 400,
      duration: 0
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

        if (that.data.tapIdx > 2 && that.data.tapIdx < 7) {
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
          "sqid": that.data.id,
          "asqlx": "1",
          "atplx": atplx
        }

        util.doUpload(util.apiFileUpload, res.tempImagePath, dataString, that.successFileUpload, that.failFileUpload)
      },
      fail: function(e) {},
      complete: function(res) {
        wx.pageScrollTo({
          //scrollTop: that.data.scroll_top,
          scrollTop: 1000,
          duration: 0
        })
      }
    })
  },
  /**
   * 图片上传成功回调方法
   * @param res 返回结果
   */
  successFileUpload: function(res) {
    util.showToast('照片上传成功！')

    let tempArr = this.data.photoArr
    tempArr[this.data.tapIndex][this.data.tapIdx] = JSON.parse(res.data).respData.showUrl
    if (this.data.tapIdx == tempArr[this.data.tapIndex].length - 1 && tempArr[this.data.tapIndex].length < 7) { //最后一张操作时，不满8张，需要再加一个占位图片
      tempArr[this.data.tapIndex].push('/imgs/jia.png')
    }

    this.setData({
      photoArr: tempArr
    })

    this.initPhoto(this.data.id)
  },
  /**
   * 图片上传失败回调方法
   * @param res 返回结果
   */
  failFileUpload: function() {
    util.showToast('照片上传失败！')
  },
  /**
   * 删除图片
   */
  deletePhoto: function(e) {
    let that = this

    let id = ''
    for (let i = 0; i < that.data.obj.asfxx.length; i++) {
      for (let j = 0; j < that.data.obj.asfxx[i].aazzp.length; j++) {
        if (that.data.obj.asfxx[i].aazzp[j].imageUrl == e.currentTarget.dataset.imgid) {
          id = that.data.obj.asfxx[i].aazzp[j].id
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
            that.setData({
              tapIndex: e.currentTarget.dataset.id,
              tapIdx: e.currentTarget.dataset.idx
            })

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

    let tempArr = this.data.photoArr
    if (this.data.tapIdx < 3) {
      tempArr[this.data.tapIndex][this.data.tapIdx] = '/imgs/cammera.png'
    } else {
      tempArr[this.data.tapIndex].splice([this.data.tapIdx], 1)
      if (tempArr[this.data.tapIndex].length == 7) { //需要补一张占位图片
        tempArr[this.data.tapIndex].push('/imgs/jia.png')
      }
    }

    this.setData({
      photoArr: tempArr
    })

    this.initPhoto(this.data.id)
  },
  /**
   * 跳转到安装位置选择画面
   */
  gotoLocation: function(e) {
    if (this.data.currentStatus == 1) {
      wx.navigateTo({
        url: '/pages/task/installlocation/installlocation?index=' + e.currentTarget.dataset.index + '&code=' + e.currentTarget.dataset.id
      })
    } else {
      let imgSrc = ''
      for (let i = 0; i < this.data.locationArr.length; i++) {
        if (this.data.locationArr[i].code == e.currentTarget.dataset.id) {
          imgSrc = this.data.locationArr[i].imageUrl
          break
        }
      }

      this.setData({
        modalHidden: false,
        currentLocationImg: util.baseUrl + imgSrc
      })
    }
  },
  /**
   * 确认提交
   */
  firstCommit: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定提交？',
      success: function(res) {
        if (res.confirm) {
          that.taskCommit()
        }
      }
    })
  },
  /**
   * 提交
   */
  taskCommit: function() {
    //是否输入安装位置
    let isLocation = true
    for (let num = 0; num < this.data.asfxx.length; num++) {
      if (util.isEmpty(this.data.selectedLocationId[num])) {
        isLocation = false
        break;
      }
    }
    if (!isLocation) {
      util.showToast('有设备的安装位置未选择！')
      return false
    }

    //是否上传所有照片
    let isPhoto = true
    for (let i = 0; i < this.data.asfxx.length; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.data.photoArr[i][j] == '/imgs/cammera.png') {
          isPhoto = false
          break;
        }
      }
    }
    if (!isPhoto) {
      util.showToast('有设备的照片没有上传！')
      return false
    }

    //通过检查，执行提交
    let temp = '['
    for (let i = 0; i < this.data.asfxx.length; i++) {
      temp += '{"gpsid":"' + this.data.asfxx[i].id + '","aazwz":"' + this.data.selectedLocationId[i] + '"},'
    }
    temp = temp.substr(0, temp.length - 1)
    temp += ']'

    let dataString = '{"asqid":"' + this.data.id + '","asqlx":"1","aazdz":"' + this.data.gpsLocation + '","gpslist":' + temp + '}'

    util.doApi(util.apiGpsSave, dataString, this.successGpsSave, this.failGpsSave)
  },
  /**
   * 提交成功回调方法
   * @param res 返回结果
   */
  successGpsSave: function(res) {
    util.showToast('提交成功！')

    getApp().globalData.localTempIdArr = []
    getApp().globalData.localTempValueArr = []

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
  },
  /**
   * 关闭安装位置弹出框
   */
  modalConfirm: function() {
    this.setData({
      modalHidden: true
    })
  },
  /**
   * 记录滚动位置
   */
  onPageScroll: function(e) {
    if (!this.data.isShow) {
      this.setData({
        scroll_top: e.scrollTop
      })
    }
  },
  /**
   * 切换前后摄像头
   */
  devicePosition: function(e) {
    let that = this

    this.setData({
      frontBack: !that.data.frontBack
    })
  },
  /**
   * 选择照片
   */
  chooseImage(e) {
    let that = this
    let index = e.currentTarget.dataset.id
    let idx = e.currentTarget.dataset.idx
    this.setData({
      currentIndex1: index,
      tapIndex: index,
      tapIdx: idx
    })

    if (this.data.photoArr[index][idx] == '/imgs/cammera.png' || this.data.photoArr[index][idx] == '/imgs/jia.png') {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          that.data.photoArr[that.data.tapIndex][that.data.tapIdx] = res.tempImagePath

          if (that.data.tapIdx > 2 && that.data.tapIdx < 7) {
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
            "sqid": that.data.id,
            "asqlx": "1",
            "atplx": atplx
          }

          util.doUpload(util.apiFileUpload, res.tempFilePaths[0], dataString, that.successFileUpload, that.failFileUpload)
        }
      })
    }
    else {
      //过滤掉占位图片
      let tempArr = this.data.photoArr[index].filter((item) => {
        return item != '/imgs/cammera.png' && item != '/imgs/jia.png'
      })

      wx.previewImage({
        current: this.data.photoArr[index][idx], //当前图片地址
        urls: tempArr, //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { }
      })
    }
  }
})