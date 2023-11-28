// pages/tabbar/tabbar.js
const netWork = require('../../utils/network.js')
const wechat = require('../../utils/wechat.js')
const app = getApp()
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    show: false,
    location: false,
    message: true
  },
  onChange(e) {
    // event.detail 的值为当前选中项的索引
    this.getUser()
    this.setData({ active: e.detail });
    if(this.data.active == 2){
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#4880FF',
      })
      wx.setNavigationBarTitle({
        title: '个人中心',
      })
    }else {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#fff',
      })
      if(this.data.active == 1){
        wx.setNavigationBarTitle({
          title: '我的卡片',
        })
      }else {
        wx.setNavigationBarTitle({
          title: '大象车库',
        })
      }
    }
  },
  // locations(e){
  //   wx.authorize({
  //     scope: 'scope.userLocation',
  //     success: (res) => {},
  //     fail: (res) => {},
  //   })
  // },
  // confirm(e) {
  //   if (e.detail.rawData) {
  //     this.setData({
  //       show: false
  //     })
  //   }
  // },
  getUser() {
    var that = this
    netWork.GET({
      url: '/user',
      params: {},
      success(res) {
        var message = res.data.data.unRead
        if (message == 0) { message = false }
        else { message = true }
        that.setData({
          message
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var reg = wx.getStorageSync('reg');
    var that = this;
    if (options.q) {
      var query = (decodeURIComponent(options.q)).split('=')
      query = query[1].split('&')
      if (query[0] == 'p') {
        app.globalData.carBarnId = query[1]
        app.globalData.carnBranSn = query[2]
        app.globalData.door = query[3]
        app.globalData.user = query[4]
        app.globalData.deviceSn = undefined
        app.globalData.ncarBarnId = undefined
        app.globalData.cardId = undefined 
      } else
      if (query[0] == 'c') {
          app.globalData.carBarnId = query[1]
          app.globalData.deviceSn = query[2]
          app.globalData.ncarBarnId = undefined
          app.globalData.cardId = undefined 
      } else if (query[0] == 'b') {
        app.globalData.ncarBarnId = query[1]
        app.globalData.carBarnId = undefined
        app.globalData.deviceSn = undefined 
        app.globalData.cardId = undefined 
      } else if (query[0] == 'ic') {
        app.globalData.cardId = 1
        app.globalData.carBarnId = undefined
        app.globalData.deviceSn = undefined 
        app.globalData.ncarBarnId = undefined
      } else {
        app.globalData.cardId = undefined
        app.globalData.carBarnId = undefined
        app.globalData.deviceSn = undefined 
        app.globalData.ncarBarnId = undefined
      }
    }
    if (reg){
      wechat.getUserInfo().then(res => {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            show: true
          })
        // } 
        // else if (!res.authSetting['scope.userLocation']){
        //   that.setData({
        //     location: true
        //   })
        }else {
          // wx.getLocation({
          //   success: function(res) {
          //     console.log(res)
          //   },
          // })
          if (app.globalData.carBarnId != undefined && app.globalData.deviceSn == undefined) {
            netWork.POST({
              url: '/order/p',
              params: {
                carBarnId: app.globalData.carBarnId,
                deviceSn: app.globalData.carnBranSn,
                gatenum: app.globalData.door,
                resident: app.globalData.user
              },
              success(res) {
                var success = res.data.success;
                if (success) {
                  if (res.data.data.canOpenDoor) {
                    wx.navigateTo({
                      url: '/pages/payAfter/payAfter?orderId=' + res.data.data.orderId,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '您不是此小区住户，请从正门出入',
                      showCancel: false
                    })
                  }
                } else {
                  wx.navigateTo({
                    url: '/pages/payMent/payMent?carBarnId=' + app.globalData.carBarnId
                  })
                }
              }
            })
          } else if (app.globalData.deviceSn != undefined) {
            this.selectComponent("#ind").getCharge()
            netWork.GET({
              url: '/orders/charge/' + app.globalData.deviceSn,
              params: {
                // amount: 1,
                // carBarnId,
                // deviceSN: deviceSn,
                // portNum: -1
              },
              success(res) {
                var orderCreated = res.data.data.orderCreated;
                var ctype = res.data.data.ctype;
                var order = res.data.data.deviceSN;
                var num = res.data.data.portNum
                var cardType = res.data.data.cardType
                if (orderCreated) {
                  if (ctype === 0){
                    wx.navigateTo({
                      url: '/pages/chargePay/chargePay?type=1'
                    })
                  }else if(ctype === 1){
                    wx.navigateTo({
                      url: '/pages/chargePay/chargePay?type=2&&pOrderNum=' + res.data.data.porderNum
                    })
                  }
                }else {
                  if (ctype === 0) {
                    if(num) {
                      wx.showModal({
                        title: '提示',
                        content: `您正在使用计时充电,请点击右上角充电标签查看,设备编号为${order},端口号为${num + 1}`,
                        showCancel: false
                      })
                    }else {
                      wx.showModal({
                        title: '提示',
                        content: `请先创建停车订单后再进行充电操作`,
                        showCancel: false
                      })
                    }
                  } else if (ctype === 1) {
                    wx.showModal({
                      title: '提示',
                      content: `您正在使用${cardType}充电,设备编号为${order},端口号为${num + 1}`,
                      showCancel: false
                    })
                  }
                }
                // if (res.data.success) {
                //   wx.showModal({
                //     title: '提示',
                //     content: '您当前已拥有正在使用的订单,临时订单可于右上角充电标签查看',
                //     showCancel: false
                //   })
                // } else {
                //   wx.navigateTo({
                //     url: '/pages/chargePay/chargePay'
                //   })
                // }
              }
            })
          } else if (app.globalData.ncarBarnId != undefined) {
            netWork.GET({
              url: '/user/bind/' + app.globalData.ncarBarnId,
              params: {},
              success(res) {
                if (res.data.data) {
                  wx.showModal({
                    title: '提示',
                    content: '您已是车库业主用户，无需再次绑定',
                    showCancel: false
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '您是否要绑定为此车库的业主用户',
                    success(res) {
                      if (res.confirm) {
                        netWork.POST({
                          url: '/user/' + app.globalData.ncarBarnId,
                          params: {},
                          success(res) {
                            if (res.data.success) {
                              Toast.success('绑定成功')
                            } else {
                              Toast.fail('绑定失败')
                            }
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          } else if (app.globalData.cardId != undefined) {
            wx.navigateTo({
              url: '/pages/photo/photo',
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.getUser()
    if(this.data.active == 1){
      this.selectComponent("#card").onload()
    }else
    if (this.data.active == 2) {
      this.selectComponent("#person").getUser()
    }else
    {
      this.selectComponent("#ind").getCharge()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})