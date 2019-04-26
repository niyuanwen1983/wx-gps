//导入通用方法js
const util = require('../../../utils/util.js')

Page({
  data: {
    date: '',
    incomed: 0, //本月收入
    income: 0, //待收入
    tasks: 0, //数量
    taskList: []
  },
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {},

  onShow: function() {
    this.initData()
  },
  /**
   * 初始化
   */
  initData: function() {
    let dataJson;
    let dateParam;

    if (util.isEmpty(this.data.date)) { //日期为空
      let currentYearMonth = new Date()
      dateParam = currentYearMonth.getFullYear() + '-' + (currentYearMonth.getMonth() + 1 >= 10 ? currentYearMonth.getMonth() + 1 : '0' + (currentYearMonth.getMonth() + 1))

      this.setData({
        date: dateParam
      })
    } else {
      dateParam = this.data.date
    }

    let dataString = '{"date":"' + dateParam + '"}'

    util.doApi(util.apiMe, dataString, this.initDataSuccess)
  },
  /**
   * 初始化回调方法
   * @param res 返回结果
   */
  initDataSuccess: function(res) {
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
      tasks: totalTask,
      taskList: res.data.respData
    })
  },
  /**
   * 日期变更
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })

    this.initData()
  },
  /**
   * 跳转到待收入/安装明细/拆机明细画面
   */
  gotoIncomeDetail:function(e){
    wx.navigateTo({
      url: '/pages/income/income?srlx=' + e.currentTarget.dataset.srlx + '&date=' + this.data.date
    })
  }
})