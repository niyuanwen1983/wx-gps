//导入通用方法js
const util = require('../../utils/util.js')

Page({
  data: {
    title: '',
    incomeArr: []
  },
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function(options) {
    let title = '待收入'
    if (options.srlx == 1) {
      title = '安装明细'
    } else if (options.srlx == 2) {
      title = '拆机明细'
    }

    this.setData({
      title: title
    })

    this.initData(options)
  },

  onShow: function() {

  },
  /**
   * 初始化
   * @param options 上一个页面的参数
   */
  initData: function(options) {
    let srlx = options.srlx //类型
    let date = options.date //年月

    if (util.isEmpty(srlx)) {
      srlx = 0
    }

    if (util.isEmpty(date)) {
      let temp = new Date()
      date = temp.getFullYear() + '-' + (temp.getMonth() + 1 >= 10 ? (temp.getMonth() + 1) : ('0' + (temp.getMonth() + 1)))
    }

    let startDate = date + '-01'
    let endDate;
    if (date.indexOf('-01') > -1 || date.indexOf('-03') > -1 || date.indexOf('-05') > -1 || date.indexOf('-07') > -1 || date.indexOf('-08') > -1 || date.indexOf('-10') > -1 || date.indexOf('-12') > -1) {
      endDate = date + '-31'
    } else if (date.indexOf('-04') > -1 || date.indexOf('-06') > -1 || date.indexOf('-09') > -1 || date.indexOf('-11') > -1) {
      endDate = date + '-30'
    } else {
      if (util.isLeapYear(date.substr(0, 4))) { //是闰年
        endDate = date + '-29'
      } else {
        endDate = date + '-28'
      }
    }

    let aspzt;
    let dataString;

    if (srlx == 0) { //待收入
      dataString = '{"aspzt":"5","startDate":"' + startDate + '","endDate":"' + endDate + '"}'
    } else {
      dataString = '{"aspzt":"2","asqlx":"' + srlx + '","startDate":"' + startDate + '","endDate":"' + endDate + '"}'
    }

    util.doApi(util.apiTaskList, dataString, this.successIncome)
  },

  successIncome: function(res) {
    if (res.data.respData.length < 1) {
      util.showToast('暂无数据！')
    } else {
      this.setData({
        incomeArr: res.data.respData
      })
    }
  }
})