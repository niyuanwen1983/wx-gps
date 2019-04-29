//导入通用方法js
const util = require('../../utils/util.js')

//获取应用实例
const app = getApp()

var template = require('../../template/template.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    taskList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    template.tabbar("tabBar", 0, this)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 显示
   */
  onShow: function() {
    this.initData()
  },
  /**
   * 初始化
   */
  initData: function() {
    let aspzt = '0' //未接单

    let dataString = '{"aspzt":"' + aspzt + '"}'

    util.doApi(util.apiTaskList, dataString, this.initDataCallback, this.initDataFailback)
  },
  /**
   * 初始化回调方法
   * @param res 返回结果
   */
  initDataCallback: function(res) {
      this.setData({
        taskList: res.data.respData
      })
  },

  initDataFailback:function(res){
    //第一次进入
    if (res.data.respMsg.indexOf('CODE:2') > -1) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 放弃接单
   */
  abandon: function(e) {
    util.showConfirm('确认放弃接单？', () => {
      let dataString = '{"asqid":"' + e.currentTarget.dataset.id + '","astatus":"0"}'

      util.doApi(util.apiTaskUpdate, dataString, this.initDataCallback)
    })
  },
  /**
   * 放弃成功回调方法
   * @param res 返回结果
   */
  abandonSuccess: function(res) {
    util.showToast('操作成功！')

    this.initData()
  },
  /**
   * 确认接单
   */
  receive: function(e) {
    util.showConfirm('确认接单？', () => {

    })
  }
})