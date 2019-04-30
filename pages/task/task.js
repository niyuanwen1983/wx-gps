//导入通用方法js
const util = require('../../utils/util.js')

var template = require('../../template/template.js')

Page({
  data: {
    currentTab: 0,
    aspzt: '1', //状态
    taskList: []
  },
  //事件处理函数
  bindViewTap: function() {},
  /**
   * 初始化
   */
  onLoad: function() {
    template.tabbar("tabBar", 1, this)
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
    let aname = ''

    //let dataString = '{"aspzt":"' + this.data.aspzt + '","aname":"' + aname + '"}'
    let dataString = '{"aspzt":"' + this.data.aspzt + '"}'

    util.doApi(util.apiTaskList, dataString, this.successTaskList)
  },
  /**
   * 初始化回调方法
   * @param res 返回结果
   */
  successTaskList: function(res) {
    this.setData({
      taskList: res.data.respData
    })
  },
  //点击切换
  clickTab: function(e) {
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      let selectedStatus = '1'
      if (e.target.dataset.current == '3,4') {
        selectedStatus = '3,4'
      } else if (e.target.dataset.current == '5') {
        selectedStatus = '5'
      } else if (e.target.dataset.current == '2') {
        selectedStatus = '2'
      } else if (e.target.dataset.current == '6') {
        selectedStatus = '6'
      }

      that.setData({
        currentTab: e.target.dataset.current,
        aspzt: selectedStatus,
        taskList: []
      })

      this.initData()
    }
  },
  /**
   * 跳转到工单详情页面
   */
  gotoDetail: function(e) {
    wx.navigateTo({
      url: '/pages/task/installdevice/installdevice?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 放弃接单
   */
  abandon: function(e) {
    util.showConfirm('确认放弃接单？', () => {
      let dataString = '{"asqid":"' + e.currentTarget.dataset.id + '","astatus":"0"}'

      util.doApi(util.apiTaskUpdate, dataString, this.abandonSuccess)
    })
  },
  /**
   * 放弃成功回调方法
   * @param res 返回结果
   */
  abandonSuccess: function(res) {
    util.showToast('放弃接单成功！')

    this.initData()
  }
})