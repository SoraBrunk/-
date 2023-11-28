const netWork = require('./network.js');
const app = getApp()

// const domain = '192.168.10.21:8078/mp/v1';
// const domain = '192.168.10.21:8078';
// const domain = '192.168.10.93:8080/mp/v1';
const domain = 'carbarnmpapi.thieldata.com/mp/v1';
// const globalUrl = 'http://' + domain;
const globalUrl = 'https://' + domain;
class Wechat {
  static promise() {
    return new Promise((resolve, reject) => wx.login({
      success: resolve,
      fail: reject
    }));
  }
  //登录
  static login() {
    this.promise()
      .then(d => {
        if (d.code) {
          var code = d.code
          wx.request({
            url: globalUrl + '/auth',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: { code },
            method: 'POST',
            success: function (res) {
              var page
              wx.setStorageSync('token', res.data.data.token);
              wx.setStorageSync('reg', res.data.data.hasRegis);
              if (getCurrentPages() !== []){
                page = getCurrentPages()[0].route
              }
              if (page !== 'pages/registerIonfo/register' && page !== 'pages/uploadFace/upLoadFace'){
                if (!res.data.data.hasRegis) {
                  wx.showModal({
                    title: '提示',
                    content: '请点击确认以完成注册',
                    showCancel: true,
                    success(res) {
                      if (res.confirm) {
                        wx.redirectTo({
                          url: '/pages/registerIonfo/register',
                        })
                      }
                    }
                  })
                }
              }
            }
          })
        }
      })
  }
  // 获取信息
  static getUserInfo(){
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success(res){
                var avatarUrl = res.userInfo
                wx.setStorageSync('user', avatarUrl)
              }
            })
          }
          resolve(res)
        }
      })
    })
  }
  // 上传
  static upload(imgPaths,type){
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '上传中',
      })
      var that = this;
      wx.uploadFile({
        url: globalUrl + '/users/avatar',
        filePath: imgPaths,
        name: 'file',
        header:{
          'content-type': 'multipart/form-data',
          'MP-Token': wx.getStorageSync('token')
        },
        success(res){
          wx.hideLoading()
          var picState = JSON.parse(res.data)
          if(picState.success){
            resolve(picState.success)
            wx.showToast({
              title: '上传成功',
              icon: 'none',
              success(res){
                if(type == 0){
                  wx.setStorageSync('reg', true)
                    wx.reLaunch({
                      url: '/pages/tabbar/tabbar',
                    })
                }
              }
            })
          }else {
            wx.showToast({
              title: '上传失败,请核实本人照片',
              icon: 'none'
            })
            reject()
          }
        },
        fail(res){}
      })
    })
 
  }
} 

module.exports = Wechat;