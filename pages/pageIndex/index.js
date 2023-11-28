// pages/pageIndex/index.js
const app = getApp()
const netWork = require('../../utils/network.js')
const wechat = require('../../utils/wechat.js')
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
Component({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['/images/all/tu1.png', '/images/all/tu2.png'],
    charge: -1
  },
  methods:{
    scanCode(){
      var that = this
      wx.scanCode({
        success: function (res) {
        var query = res.result.split('=')
          // var query = (decodeURIComponent(options.q)).split('=')
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
          const carBarnId = app.globalData.carBarnId
          const deviceSn = app.globalData.deviceSn
          const state = app.globalData.state
          const reg = wx.getStorageSync('reg')
          if (reg) {
            if (carBarnId != undefined && deviceSn == undefined) {
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
                        content: '您不是此小区住户',
                        showCancel: false
                      })
                    }
                  } else {
                    wx.navigateTo({
                      url: '/pages/payMent/payMent?carBarnId=' + carBarnId
                    })
                  }
                }
              })
            } else
            if (deviceSn != undefined) {
              that.getCharge()
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
                  var num = res.data.data.portNum;
                  var cardType = res.data.data.cardType;
                  var errorCode = res.data.data.errorCode;
                  if (orderCreated) {
                    if (ctype === 0) {
                      wx.navigateTo({
                        url: '/pages/chargePay/chargePay?type=1'
                      })
                    } else if (ctype === 1) {
                      wx.navigateTo({
                        url: '/pages/chargePay/chargePay?type=2&&pOrderNum=' + res.data.data.porderNum
                      })
                    }
                  } else {
                    if (ctype === 0) {
                      if (errorCode == 500) {
                        wx.showModal({
                          title: '提示',
                          content: `您当前有正在进行中的计时充电，请勿重复充电`,
                          showCancel: false
                        })
                      } else if (errorCode == 501) {
                        wx.showModal({
                          title: '提示',
                          content: `您当前没有办理停车业务，不能计时充电`,
                          showCancel: false
                        })
                      } else if (errorCode == 502) {
                        wx.showModal({
                          title: '提示',
                          content: `您当前包月停车的车型为自行车，不能计时充电`,
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
              
            } else
            if (app.globalData.ncarBarnId != undefined) {
              netWork.GET({
                url: '/user/bind/' + app.globalData.ncarBarnId,
                params: {},
                success(res) {
                  if(res.data.data){
                    wx.showModal({
                      title: '提示',
                      content: '您已是车库业主用户，无需再次绑定',
                      showCancel: false
                    })
                  }else {
                    wx.showModal({
                      title: '提示',
                      content: '您是否要绑定为此车库的业主用户',
                      success(res) {
                        if (res.confirm) {
                          netWork.POST({
                            url: '/user/' + app.globalData.ncarBarnId,
                            params: {},
                            success(res) {
                              console.log(res)
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
              
            } else
            if (app.globalData.cardId != undefined) {
              wx.navigateTo({
                url: '/pages/photo/photo',
              })
            }
          }else {
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
        },
        fail(){
        }
      })
    },
    charge(){
      wx.navigateTo({
        url: '../charge/charge',
      })
    },
    getCharge(){
      var that = this
      if (app.globalData.deviceSn){
          netWork.GET({
            url: '/orders/charge/' + app.globalData.deviceSn,
            params: {},
            success(res) {
              var orderCreated = res.data.data.orderCreated;
              var ctype = res.data.data.ctype;
              var num = res.data.data.deviceSN;
              if (!orderCreated && ctype == 0 && num){
                that.setData({
                  charge : 1
                })
              }
            }
        })
      }
    }
  },
  ready(){
    this.getCharge()
  }
})