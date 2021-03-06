//导入通用方法js
const util = require('../../utils/util.js')
//导入路由
const routes = require('../../router/routes.js')

var template = require('../../template/template.js')

Page({
  data: {
    currentTab: 0,
    aspzt: '1', //状态
    taskList: [],
    searchList: [],
    showFlag: false,
    showTrue: true,
    showInputStatus: false,
    inputValue: ''
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
  //点击显示
  clickShow: function() {
    var that = this;
    if (that.data.showFlag == false) {
      that.setData({
        showFlag: true,
        showTrue: false
      })
    }
  },
  //点击隐藏
  clickCancel: function() {
    var that = this;
    if (that.data.showFlag == true) {
      that.setData({
        showFlag: false,
        showTrue: true
      })
    }

    that.setData({
      inputValue: "",
      showInputStatus: false
    });

    //重新初始化
    this.initData()
  },
  //搜索
  bindKeyInput: function(e) {
    var currentInputStatu = e.currentTarget.dataset.statu;
    var prefix = e.detail.value; //用户实时输入值
    var newSource = []; //匹配的结果

    if (prefix != "") {
      let dataString = '{"aspzt":"' + this.data.aspzt + '","aname":"' + prefix + '"}'
      util.doApi(util.apiTaskList, dataString, this.successSearchList)
    } else {
      currentInputStatu = "close";
    }

    if (newSource.length != 0) {
      this.setData({
        taskList: newSource
      })
    } else {
      this.setData({
        taskList: []
      })
      currentInputStatu = "close";
    }
    //关闭 
    if (currentInputStatu == "close") {
      this.setData({
        showInputStatus: false
      })
    }
    // 显示 
    if (currentInputStatu == "open") {
      this.setData({
        showInputStatus: true
      });
    }
  },
  //失去焦点
  bindInputBlur: function(e) {
    var currentInputStatu = e.currentTarget.dataset.statu;
    var prefix = e.detail.value; //用户输入值
    var newSource = []; //匹配的结果

    if (prefix != "") {
      let dataString = '{"aspzt":"' + this.data.aspzt + '","aname":"' + prefix + '"}'
      util.doApi(util.apiTaskList, dataString, this.successTaskList)
    } else {
      currentInputStatu = "close";
    }

    if (newSource.length != 0) {
      this.setData({
        taskList: newSource
      })
    } else {
      this.setData({
        taskList: []
      })
      currentInputStatu = "close";
    }
    //关闭 
    if (currentInputStatu == "close") {
      this.setData({
        showInputStatus: false
      })
    }
    // 显示 
    if (currentInputStatu == "open") {
      this.setData({
        showInputStatus: true
      });
    }
  },
  /**
   * 检索回调方法
   * @param res 返回结果
   */
  successSearchList: function(res) {
    if (res.data.respData.length > 0) {
      this.setData({
        showInputStatus: true
      })
    }
    this.setData({
      searchList: res.data.respData
    })
  },
  //点击选型确定input值
  itemtap: function(e) {
    var currentInputStatu = e.currentTarget.dataset.statu;

    this.setData({
      inputValue: e.target.id,
      taskList: []
    })
    //关闭 
    if (currentInputStatu == "close") {
      this.setData({
        showInputStatus: false
      });
    }
    // 显示 
    if (currentInputStatu == "open") {
      this.setData({
        showInputStatus: true
      });
    }
  },
  /**
   * 跳转到工单详情页面
   */
  gotoDetail: function(e) {
    wx.navigateTo({
      url: '/pages/task/deviceconfirm/deviceconfirm?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type
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
  },
  /**
   * 点击行事件（只有审核中和已完成响应）
   */
  clickRow: function(e) {
    if (e.currentTarget.dataset.status == '2' || e.currentTarget.dataset.status == '3,4') {
      if (e.currentTarget.dataset.type == 1) {
        wx.navigateTo({
          url: routes.installdetail + '?id=' + e.currentTarget.dataset.id + '&status=0'
        })
      } else {
        wx.navigateTo({
          url: routes.uninstalldetail + '?id=' + e.currentTarget.dataset.id + '&status=0'
        })
      }
    } else {
      return false
    }
  }
})