// pages/payMent/payMent.js
const netWork = require('../../utils/network.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: '',
    change: ['select', 'unselect','unselect'],
    card: ['scard','uscard'],
    order: {},
    data: '',
    id: 1,
    dayId: 0,
    disabled: false,
    disabled_charge: false,
    show: false,
    car_charge_show: false,
    timeshow: false,
    time_charge_show: false,
    time_content: ['一个月','两个月','三个月','半年','一年'],
    time_content_charge: ['一个月', '两个月', '三个月', '半年', '一年'],
    month: 1,
    month_charge: 1,
    car_index: 1,
    car_index_charge: 0,
    time_index:0,
    time_index_charge: 0,
    time: '一个月',
    time_charge: '一个月',
    car: ' 二轮电动车',
    car_charge: '二轮电动车',
    home_code: '',
    home_code_charge: '',
    car_type: '',
    car_type_charge: '',
  },
  selectcar() {
    this.setData({ show: true })
  },
  time() {
    this.setData({ timeshow: true })
  },
  time_charge() {
    this.setData({ time_charge_show: true });
  },
  time_charge_close() {
    this.setData({ time_charge_show: false });
  },
  onClose() {
    this.setData({ show: false });
  },
  car_charge() {
    this.setData({ car_charge_show: true });
  },
  car_charge_close() {
    this.setData({ car_charge_show: false });
  },
  timeClose() {
    this.setData({ timeshow: false });
  },
  car_change(e) {
    var value = e.detail.value;
    for (var index in this.data.order.ruleVos[1].carTypes) {
      if (this.data.order.ruleVos[1].carTypes[index].value == value) {
        this.setData({
          car_index: index,
          car: value,
          show: false
        })
      }
    }
  },
  car_change_charge(e) {
    var value = e.detail.value;
    for (var index in this.data.order.ruleVos[2].carTypes) {
      if (this.data.order.ruleVos[2].carTypes[index].value == value) {
        this.setData({
          car_index_charge: index,
          car_charge: value,
          car_charge_show: false
        })
      }
    }
  },
  time_change(e) {
    var value = e.detail.value;
    for (var index in this.data.time_content) {
      if (this.data.time_content[index] == value) {
      var month = Number(index) + 1;
      if(month == 4){month = 6}
      if(month == 5){month = 12}
        this.setData({
          time_index: index,
          time: value,
          timeshow: false,
          month
        })
      }
    }
  },
  time_change_charge(e) {
    var value = e.detail.value;
    for (var index in this.data.time_content_charge) {
      if (this.data.time_content_charge[index] == value) {
        var month = Number(index) + 1;
        if (month == 4) { month = 6 }
        if (month == 5) { month = 12 }
        this.setData({
          time_index_charge: index,
          time_charge: value,
          time_charge_show: false,
          month_charge: month
        })
      }
    }
  },
  //选择办理业务
  change(e){
    var type = e.currentTarget.dataset.type
    if(type == 1){
      this.setData({
        change: ['select', 'unselect', 'unselect']
      })
    }else if(type == 2) {
      this.setData({
        change: ['unselect', 'select', 'unselect']
      })
    }else if(type == 3) {
      this.setData({
        change: ['unselect', 'unselect', 'select']
      })
    }
  },
  //选择套餐
  select(e){
    var id =e.currentTarget.dataset.id 
    this.setData({ id })
  },
  daySelect(e) {
    var dayId = e.currentTarget.dataset.id
    this.setData({ dayId })
  },
  //判断是否阅读规定
  state(e){
    if(this.data.disabled){
      this.setData({
        disabled: false
      })
    }else {
      this.setData({
        disabled: true
      })
    }
  },
  state_charge(e) {
    if (this.data.disabled_charge) {
      this.setData({
        disabled_charge: false
      })
    } else {
      this.setData({
        disabled_charge: true
      })
    }
  },
  home_code(e){
    var home_code = e.detail.value
    this.setData({ home_code })
  },
  home_code_charge(e) {
    var home_code_charge = e.detail.value
    this.setData({ home_code_charge  })
  },
  car_type(e){
    var car_type = e.detail.value
    this.setData({ car_type })
  },
  car_type_charge(e) {
    var car_type_charge = e.detail.value
    this.setData({ car_type_charge })
  },
  //支付
  pay(){
    var local = this.data.location;
    var paytype = 0;
    var that = this
    for (var index in this.data.change){
      if (this.data.change[index] == 'select'){
        paytype = index
      }
    }
    if(paytype == 0){
      var carType = that.data.order.ruleVos[0].carTypes[that.data.id].key;
      var totalPrice = that.data.order.ruleVos[0].unitPrices[that.data.id] * that.data.order.ruleVos[0].ratios[that.data.dayId] * that.data.order.ruleVos[0].days * 100;
      netWork.POST({
        url: '/order',
        params: {
          carBarnId: that.data.order.carBarnId,
          carType,
          parkingType: 1,
          amount: that.data.order.ruleVos[0].ratios[that.data.dayId],
          totalPrice,
          deviceSn: app.globalData.carnBranSn,
          gatenum: app.globalData.door,
          resident: app.globalData.user
        },
        success(res){
          if(res.data.success){
            var pay = res.data.data.wxpayorder
            var order = res.data.data.order
            wx.requestPayment({
              timeStamp: pay.timeStamp,
              nonceStr: pay.nonceStr,
              package: pay.packageValue,
              signType: pay.signType,
              paySign: pay.paySign,
              success(res) { 
                wx.redirectTo({
                  url: '/pages/payAfter/payAfter?orderId='+ order.orderId,
                })
              },
              fail(res) {
                netWork.POST({
                  url: '/orders/'+order.orderId,
                  params: {},
                  success(res){
                  }
                })
              }
            })
          }else {
            wx.showModal({
              title: '提示',
              content: '您不是此小区住户',
              showCancel: false
            })
          }
          
        }
      })
    } 
    else if (paytype == 1){
      if (this.data.disabled){
        var home_code = this.data.home_code;
        var car_type = this.data.car_type
        if(!car_type){
          wx.showToast({
            title: '请填写完整信息',
            icon:'none'
          })
        }else {
          var carBarnId = this.data.order.carBarnId
          var carType = this.data.order.ruleVos[1].carTypes[this.data.car_index].key
          var timetype = this.data.month
          var brand = this.data.car_type
          var roomNum = this.data.home_code
          var cardId = ''
          var deviceSn = app.globalData.carnBranSn
          var gatenum = app.globalData.door
          var resident = app.globalData.user
          if (that.data.data != ''){
            cardId = that.data.data.cardId
            deviceSn = that.data.data.deviceSn
            gatenum = that.data.data.gatenum
            resident = that.data.data.resident
          }
          netWork.POST({
            url: '/order',
            params: {
              brand,
              amount: timetype,
              roomNum,
              carBarnId,
              carType,
              cardId,
              parkingType: 2,
              deviceSn,
              gatenum,
              resident
            },
            success(res) {
              if(res.data.success){
                var pay = res.data.data.wxpayorder
                var order = res.data.data.order
                wx.requestPayment({
                  timeStamp: pay.timeStamp,
                  nonceStr: pay.nonceStr,
                  package: pay.packageValue,
                  signType: pay.signType,
                  paySign: pay.paySign,
                  success(res) {
                    wx.showModal({
                      title: '提示',
                      content: '月卡办理完成,请重新扫码或刷卡开门',
                      showCancel: false,
                      success(res){
                        if(res.confirm){
                          wx.navigateBack({
                            delta: 1
                          })
                        }
                      }
                    })
                  },
                  fail(res) {
                    netWork.POST({
                      url: '/orders/' + order.orderId,
                      params: {},
                      success(res) {
                      }
                    })
                  }
                })
              }else {
                wx.showModal({
                  title: '提示',
                  content: '您不是此小区住户',
                  showCancel: false
                })
              }
            }
          })
        }
      }else {
        wx.showToast({
          title: '请仔细阅读规定',
          icon:'none'
        })
      }
    }
    else if (paytype == 2){
      if (this.data.disabled_charge) {
        var home_code = this.data.home_code_charge;
        var car_type = this.data.car_type_charge;
        if (!car_type) {
          wx.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
        } else {
          var carBarnId = this.data.order.carBarnId
          var carType = this.data.order.ruleVos[2].carTypes[this.data.car_index_charge].key
          var timetype = this.data.month_charge
          var brand = this.data.car_type_charge
          var roomNum = this.data.home_code_charge
          var cardId = ''
          var deviceSn = app.globalData.carnBranSn
          var gatenum = app.globalData.door
          var resident = app.globalData.user
          if (that.data.data != '') {
            cardId = that.data.data.cardId
            deviceSn = that.data.data.deviceSn
            gatenum = that.data.data.gatenum
            resident = that.data.data.resident
          }
          netWork.POST({
            url: '/order',
            params: {
              brand,
              amount: timetype,
              roomNum,
              carBarnId,
              carType,
              cardId,
              parkingType: 3,
              deviceSn,
              gatenum,
              resident
            },
            success(res) {
              if (res.data.success) {
                var pay = res.data.data.wxpayorder
                var order = res.data.data.order
                wx.requestPayment({
                  timeStamp: pay.timeStamp,
                  nonceStr: pay.nonceStr,
                  package: pay.packageValue,
                  signType: pay.signType,
                  paySign: pay.paySign,
                  success(res) {
                    wx.showModal({
                      title: '提示',
                      content: '月卡办理完成,请重新扫码或刷卡开门',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          wx.navigateBack({
                            delta: 1
                          })
                        }
                      }
                    })
                  },
                  fail(res) {
                    netWork.POST({
                      url: '/orders/' + order.orderId,
                      params: {},
                      success(res) {
                      }
                    })
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '您不是此小区住户',
                  showCancel: false
                })
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: '请仔细阅读规定',
          icon: 'none'
        })
      }
    }
  },
  readme(e) {
    var id = e.currentTarget.id;
    if (id == 'd1' || id == 'd3'){
      wx.navigateTo({
        url: '../helpc/helpc?id=c6',
      })
    } else if (id == 'd2' || id == 'd4'){
      wx.navigateTo({
        url: '../helpc/helpc?id=c5',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var carBarnId
    if (options.carBarnId) {
      carBarnId = options.carBarnId
    } else if (options.data) {
      carBarnId = JSON.parse(options.data).carBarnId
      this.setData({
        data: JSON.parse(options.data),
        change: ['unselect', 'unselect', 'select']
      })
    }
    var that = this
    netWork.GET({
      url: '/carbarns/' +carBarnId,
      params: {},
      success(res){
        that.setData({
          order: res.data.data
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