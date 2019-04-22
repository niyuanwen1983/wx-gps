//导入通用方法js
const util = require('../../utils/util.js')

Page({
  data: {
    incomeArr:[]
  },
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {
    let dataString = '{}'

    util.doApiMock('https://www.easy-mock.com/mock/5c6c15b5ab815c130b4720c7/example/gpsincome', dataString, this.successIncome)
  },
  successIncome: function(res) {
    console.log(res)

    this.setData({
      incomeArr: res.data.respData.imageCodes
    })
  }
})