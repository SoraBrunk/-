// pages/chargePay/chargePay.js
const netWork = require('../../utils/network.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carBarnName: '',
    time: [2,3,4,5,6,8,10,11,12],
    port: '',
    port_id: 0,
    id: 0,
    money: 0.5,
    payMoney: 0.5,
    show: false,
    portNum:'',
    carBarnId:'',
    deviceSn: '',
    type: 1,
    pOrderNum: 0
  },
  //选择套餐
  select(e){
    var id = e.currentTarget.dataset.id
    var money = this.data.time[id] * this.data.money;
    money =money.toFixed(2)
    this.setData({
      id,
      payMoney: money
    })
  },
  // // 选择端口
  select_port(e) {
    var id = e.currentTarget.dataset.id
    if(this.data.port[id].state < 4 ){
      this.setData({
        port_id: id
      })
    }
  },
  // 遮罩层
  onClickShow() {
    this.setData({ show: true });
  },

  onClickHide() {
    this.setData({ show: false });
  },
  // 支付
  pay(e){
    var port_id = this.data.port_id;
    var id = Number(this.data.id) + 2 ;
    var carBarnId = this.data.carBarnId
    var deviceSn = this.data.deviceSn
    var portNum = this.data.portNum
    if (id == 7){ id = 8 }
    else if (id == 8){ id= 10 }
    else if (id == 9){ id= 11 }
    else if (id == 10){ id= 12 }
    if (this.data.port) {
      netWork.GET({
        url: '/charge/devices/online/' + deviceSn,
        params: {},
        success(res) {
          var state = res.data.data[port_id].state
          if(state == 0){
            wx.showModal({
              title: '提示',
              content: '请插入充电器后进行充电',
              showCancel: false
            })
          }else if (state == 1){
            wx.showModal({
              title: '提示',
              content: '该端口正在充电中，请勿拔出插头',
              showCancel: false
            })
          }else if (state == 3){
            wx.showModal({
              title: '提示',
              content: '充电已完成，请更换充电器或端口进行充电',
              showCancel: false
            })
          }else if (state == 4){
            wx.showModal({
              title: '提示',
              content: '该端口故障中，请更换端口进行充电',
              showCancel: false
            })
          }else if (state == -1){
            wx.showModal({
              title: '提示',
              content: '网络延时，请稍后重试',
              showCancel: false
            })
          }else{
            netWork.POST({
              url: '/order/charge',
              params: {
                amount: id,
                carBarnId,
                deviceSN: deviceSn,
                portNum: port_id,
                chargeType: 0
              },
              success(res) {
                var order = res.data.data.order
                var pay = res.data.data.wxpayorder
                wx.requestPayment({
                  timeStamp: pay.timeStamp,
                  nonceStr: pay.nonceStr,
                  package: pay.packageValue,
                  signType: pay.signType,
                  paySign: pay.paySign,
                  success(res) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'none',
                      success() {
                        setTimeout(function () {
                          wx.navigateBack({
                            delta: 1
                          })
                        }, 500)
                      }
                    })
                  },
                  fail(res) {
                    netWork.POST({
                      url: '/orders/charge/' + order.orderId,
                      params: {},
                      success(res) {
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
    
  },
  confirm(e){
    var port_id = this.data.port_id;
    var carBarnId = this.data.carBarnId
    var deviceSn = this.data.deviceSn
    var portNum = this.data.portNum
    var pOrderNum = this.data.pOrderNum
    if (this.data.port) {
      netWork.GET({
        url: '/charge/devices/online/' + deviceSn,
        params: {},
        success(res) {
          var state = res.data.data[port_id].state
          if(state == 0){
            wx.showModal({
              title: '提示',
              content: '请插入充电器后进行充电',
              showCancel: false
            })
          }else if (state == 1){
            wx.showModal({
              title: '提示',
              content: '该端口正在充电中，请勿拔出插头',
              showCancel: false
            })
          }else if (state == 3){
            wx.showModal({
              title: '提示',
              content: '充电已完成，请更换充电器或端口进行充电',
              showCancel: false
            })
          }else if (state == 4){
            wx.showModal({
              title: '提示',
              content: '该端口故障中，请更换端口进行充电',
              showCancel: false
            })
          }else if (state == -1){
            wx.showModal({
              title: '提示',
              content: '网络延时，请稍后重试',
              showCancel: false
            })
          }else{
            wx.showModal({
              title: '提示',
              content: `请确认是否以端口${port_id +1}进行充电`,
              showCancel: true,
              success(res) {
                if (res.confirm) {
                  netWork.POST({
                    url: '/order/charge',
                    params: {
                      amount: 0,
                      carBarnId,
                      deviceSN: deviceSn,
                      portNum: port_id,
                      porderNum: pOrderNum,
                      chargeType: 1
                    },
                    success(res) {
                      if(res.data.success){
                        wx.showToast({
                          title: '开始充电',
                          icon: 'none',
                          success() {
                            setTimeout(function () {
                              wx.navigateBack({
                                delta: 1
                              })
                            }, 500)
                          }
                        })
                      }else {
                        wx.showToast({
                          title: '充电失败',
                          icon: 'none',
                          duration: 1500,
                          success() {
                          }
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
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    var type = options.type
    var carBarnId = app.globalData.carBarnId;
    var deviceSn = app.globalData.deviceSn;
    if (options.pOrderNum){
      this.setData({
        pOrderNum: options.pOrderNum
      })
    }
    that.onClickShow()
    that.setData({
      type
    })
    netWork.GET({
      url: '/charge/devices/' + carBarnId + '/' + deviceSn,
      params: {},
      success(res){
        that.setData({
          carBarnName: res.data.data.carBarnName,
          deviceSn: res.data.data.deviceSn,
          money: res.data.data.unitPrice,
          payMoney: res.data.data.unitPrice.toFixed(2) * 2,
          carBarnId: res.data.data.carBarnId
        })
        wx.showLoading()
        netWork.GET({
          url: '/charge/devices/online/' + res.data.data.deviceSn,
          params: {},
          success(res){
            wx.hideLoading()
            that.setData({
              port: res.data.data
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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