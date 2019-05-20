//导入通用方法js
const util = require('/utils/util.js')

//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.getSystemInfo({
      success: function(res) {
        //设备型号
        wx.setStorageSync('device', res.model.replace(/</g, '').replace(/>/g, ''));
        //微信版本号
        wx.setStorageSync('wxversion', res.version)
      }
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var resCode = res.code
        if (res.code) {
          wx.getUserInfo({
            success: function (res) {
              var objz = {};
              objz.avatarUrl = res.userInfo.avatarUrl;
              objz.nickName = res.userInfo.nickName;

              wx.setStorageSync('userInfo', objz); //存储userInfo
            }
          });

          //获取openid
          if (util.isEmpty(wx.getStorageSync('openid'))) {
            let dataString = '{"jsCode":"' + resCode + '"}'

            util.doApi(util.apiGetOpenid, dataString, function (res) {

              wx.setStorageSync('openid', res.data.respData.openid)
            })
          }
        }
      }
    }) 

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        /*if (res.authSetting['scope.userLocation'] == undefined || res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API

                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        }*/
      }
    })
  },
  globalData: {
    userInfo: null
  }
})