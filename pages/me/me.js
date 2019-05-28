//导入通用方法js
const util = require('../../utils/util.js')
//导入路由
const routes = require('../../router/routes.js')

var template = require('../../template/template.js')

Page({
  data: {
    isShowStar: true, //是否显示*
    incomed: 0, //本月收入
    income: 0, //待收入
    tasks: 0 //数量
  },
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {
    template.tabbar("tabBar", 2, this)
  },

  onShow: function() {
    this.initData()

    //获取用户信息（是否显示*）
    this.initAccount()
  },

  initAccount: function(res) {
    let dataString = '{}'
    util.doApi(util.apiGetUserInfo, dataString, this.successAccount)
  },

  successAccount: function(res) {
    this.setData({
      isShowStar: res.data.respData.iyhlx == 0 ? true : false
    })
  },

  initData: function(res) {
    let currentYearMonth = new Date()
    let dateParam = currentYearMonth.getFullYear() + '-' + (currentYearMonth.getMonth() + 1 >= 10 ? currentYearMonth.getMonth() + 1 : '0' + (currentYearMonth.getMonth() + 1))
    let dataJson = {
      "date": currentYearMonth.getFullYear() + '-' + (currentYearMonth.getMonth() + 1 < 10 ? currentYearMonth.getMonth() + 1 : '0' + (currentYearMonth.getMonth() + 1))
    }
    let dataString = '{"date":"' + dateParam + '"}'

    util.doApi(util.apiMe, dataString, this.successMe)
  },

  successMe: function(res) {
    let totalMoney = 0 //本月收入
    let totalTask = 0 //台数

    res.data.respData.forEach((item, index) => {
      if (item.srlx == 0) {
        this.setData({
          income: item.fje
        })
      } else {
        totalMoney += item.fje
        totalTask += item.its
      }
    })

    this.setData({
      incomed: totalMoney,
      tasks: totalTask
    })
  },
  /**srlx 
   * 跳转到待收入页面
   */
  gotoIncome: function() {
    wx.navigateTo({
      url: routes.income
    })
  },
  /**
   * 跳转到待消息中心页面
   */
  gotoMessages: function() {
    wx.navigateTo({
      url: '/pages/me/messages/messages?a=1'
    })
  },
  /**
   * 跳转到待收入页面
   */
  gotoMyincome: function() {
    wx.navigateTo({
      url: routes.myincome
    })
  }
})