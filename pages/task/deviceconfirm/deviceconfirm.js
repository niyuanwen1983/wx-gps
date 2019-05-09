//导入通用方法js
const util = require('../../../utils/util.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    id: '',
    type: '', //1：装机；其他：拆机
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
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function(options) {
    this.setData({
      id: options.id,
      type: options.type
    })

    this.initData(options.id)
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
   * 跳转到工单详情页面
   */
  gotoDetail: function(e) {
    if (this.data.type == 1) {
      wx.navigateTo({
        url: '/pages/task/installdevice/installdevice?id=' + this.data.id
      })
    } else {
      wx.navigateTo({
        url: '/pages/task/teardowndevice/teardowndevice?id=' + this.data.id
      })
    }
  },
  backToTask: function(e) {
    wx.navigateBack()
  }
})