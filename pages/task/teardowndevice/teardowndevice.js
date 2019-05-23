//导入通用方法js
const util = require('../../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isInit: true,
    id: '',
    isShow: false,
    currentIndex1: -1,
    locationId: '',
    locationName: '',
    gpsLocation: '',

    tapIndex: -1, //点击图片的设备序号
    tapIdx: -1, //点击图片的序号

    selectedLocationId: [], //拆机情况id
    selectedLocationValue: [], //拆机情况名称

    selectedLocationId2: [], //安装位置id
    selectedLocationValue2: [], //安装位置名称

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
    acjbz: '', //备注
    acjqk: [], //拆机情况
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

    this.initData(this.data.id)

    //获取安装位置图片
    let dataString = '{}'
    util.doApi(util.apiConfig, dataString, this.successConfig)
  },
  /**
   * 获取安装图片成功回调方法
   * @param res 返回结果
   */
  successConfig: function(res) {
    this.setData({
      locationArr: res.data.respData.instLocs
    })
  },

  onShow: function(options) {
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
    for (let i = 0; i < this.data.acjqk.length; i++) {
      res.data.respData.asfxx[i].acjqk = this.data.acjqk[i]
    }

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
      acjbz: res.data.respData.acjbz,
      obj: res.data.respData
    })

    //拆机情况只初始化一次
    if (this.data.isInit) {
      let selectedLocationIdTemp = []
      let selectedLocationValueTemp = []
      let acjqk = []
      for (let i = 0; i < res.data.respData.asfxx.length; i++) {
        selectedLocationIdTemp.push('')
        selectedLocationValueTemp.push('')

        acjqk.push('')
      }
      this.setData({
        selectedLocationId: selectedLocationIdTemp,
        selectedLocationValue: selectedLocationValueTemp,
        acjqk: acjqk
      })

      let selectedLocationIdTemp2 = []
      let selectedLocationValueTemp2 = []
      for (let i = 0; i < res.data.respData.asfxx.length; i++) {
        //是否有安装位置
        if (util.isEmpty(res.data.respData.asfxx[i].aazwz)) { //没有安装位置
          selectedLocationIdTemp2.push('')
          selectedLocationValueTemp2.push('')
        } else { //有安装位置
          selectedLocationIdTemp2.push(res.data.respData.asfxx[i].aazwz)
          selectedLocationValueTemp2.push(res.data.respData.asfxx[i].aazwz)
        }
      }
      this.setData({
        selectedLocationId2: selectedLocationIdTemp2,
        selectedLocationValue2: selectedLocationValueTemp2
      })
    }

    //初始化照片数组
    let photoArrTemp = []
    for (let ii = 0; ii < res.data.respData.asfxx.length; ii++) {
      let photos = ['/imgs/cammera.png', '/imgs/jia.png']
      for (let j = 0; j < res.data.respData.asfxx[ii].aazzp.length; j++) {
        if (j <= 1) {
          if (res.data.respData.asfxx[ii].aazzp[j].afjxl == '1001') {
            photos[0] = res.data.respData.asfxx[ii].aazzp[j].imageUrl
          } else {
            photos[1] = res.data.respData.asfxx[ii].aazzp[j].imageUrl
          }
        } else {
          photos.push(res.data.respData.asfxx[ii].aazzp[j].imageUrl)
        }
      }
      if (photos.length > 1 && photos.length < 6 && photos[photos.length - 1] != '/imgs/jia.png' && this.data.currentStatus == 1) {
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
      scrollTop: 1000,
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

        if (that.data.tapIndex > 0 && that.data.tapIndex < 5) {
          that.data.photoArr[that.data.tapIndex].push('/imgs/jia.png')
        }

        this.setData({
          photoArr: that.data.photoArr,
          isShow: false
        })

        let atplx = '1004'
        if (that.data.tapIdx == 0) {
          atplx = '1001'
        }

        let id = that.data.asfxx[that.data.tapIndex].id

        let dataString = {
          "id": id,
          "sqid": that.data.id,
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
    util.showToast('照片上传成功！')

    let tempArr = this.data.photoArr
    tempArr[this.data.tapIndex][this.data.tapIdx] = JSON.parse(res.data).respData.showUrl
    if (this.data.tapIdx >= 1 && this.data.tapIdx <= 4) { //最后一张操作时，不满8张，需要再加一个占位图片
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
    if (this.data.tapIdx < 1) {
      tempArr[this.data.tapIndex][this.data.tapIdx] = '/imgs/cammera.png'
    } else {
      tempArr[this.data.tapIndex].splice([this.data.tapIdx], 1)
      if (tempArr[this.data.tapIndex].length == 5 && tempArr[this.data.tapIndex][tempArr[this.data.tapIndex].length - 1] != '/imgs/jia.png') { //需要补一张占位图片
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
    let imgSrc = ''
    for (let i = 0; i < this.data.locationArr.length; i++) {
      if (this.data.locationArr[i].name == e.currentTarget.dataset.id) {
        imgSrc = this.data.locationArr[i].imageUrl
        break
      }
    }

    this.setData({
      modalHidden: false,
      currentLocationImg: util.baseUrl + imgSrc
    })
  },
  /**
   * 确认提交
   */
  firstCommit: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定选择该位置进行安装？',
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
    //是否上传所有照片
    let isPhoto = true
    for (let i = 0; i < this.data.asfxx.length; i++) {
      for (let j = 0; j < 1; j++) {
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

    //是否设置了拆机情况
    let isCJQK = true
    for (let i = 0; i < this.data.asfxx.length; i++) {
      if (this.data.asfxx[i].acjqk == '') {
        isCJQK = false
      }
    }
    if (!isCJQK) {
      util.showToast('有设备的拆机情况没有选择！')
      return false
    }

    //通过检查，执行提交
    let temp = '['
    for (let i = 0; i < this.data.asfxx.length; i++) {
      temp += '{"gpsid":"' + this.data.asfxx[i].id + '","acjqk":"' + this.data.asfxx[i].acjqk + '"},'
    }
    temp = temp.substr(0, temp.length - 1)
    temp += ']'

    let dataString = '{"asqid":"' + this.data.id + '","asqlx":"1","aazdz":"' + this.data.acjbz + '","gpslist":' + temp + '}'

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
   * 点击拆机情况
   */
  checkItem: function(e) {
    let tempArr = this.data.asfxx

    tempArr[e.currentTarget.dataset.index].acjqk = e.currentTarget.dataset.value

    let tempAcjqk = this.data.acjqk
    tempAcjqk[e.currentTarget.dataset.index] = e.currentTarget.dataset.value

    this.setData({
      asfxx: tempArr,
      acjqk: tempAcjqk
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
  }
})