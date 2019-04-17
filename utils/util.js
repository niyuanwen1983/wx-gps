const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 判断对象是否为空
 */
const isEmpty = obj => {
  if (obj == null || obj == undefined || obj == '') {
    return true
  } else {
    return false
  }
}

const api1 = 'https://www.easy-mock.com/mock/5c6c15b5ab815c130b4720c7/example/IndexList'

/**
 * 显示toast
 * @title 显示内容
 */
const showToast = (title) => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 3000
  })
}

/**
 * 请求api
 * @url 请求地址
 * @params 请求参数
 * @successFunction 成功的回调方法
 * @failFunction 失败的回调方法
 */
const doApi = (url, params, successFunction, failFunction) => {
  wx.showLoading({
    title: '加载中......',
  })
  
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      wx.hideLoading()
      if (typeof successFunction == "function") {
        successFunction(res);
      }
    },
    fail: function(res) {
      wx.hideLoading()
      if (typeof failFunction == "function") {
        failFunction(res);
      }
    }
  })
}

module.exports = {
  api1: api1,
  formatTime: formatTime,
  isEmpty: isEmpty,
  showToast: showToast,
  doApi: doApi
}