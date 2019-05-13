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
        wx.setStorageSync('device', res.model);
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
              //console.log(objz);
              wx.setStorageSync('userInfo', objz); //存储userInfo
            }
          });

          //获取openid
          if (util.isEmpty(wx.getStorageSync('openid'))) {
            let dataString = '{"jsCode":"' + resCode + '"}'
            console.log('resCode=' + resCode)
            util.doApi(util.apiGetOpenid, dataString, function (res) {
              console.log('res=' + res.data.respData.openid)
              wx.setStorageSync('openid', res.data.respData.openid)
            })
          }
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
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
        if (res.authSetting['scope.userLocation'] == undefined || res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
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
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    appid: 'wx4e070a913c7f4b22',
    secret: '592a9796d9832363ad9a4a39849fb926'
  }
})