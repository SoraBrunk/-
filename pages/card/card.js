// pages/payMent/payMent.js
const netWork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    location: '请选择车库',
    card: ['scard', 'uscard'],
    index: 0,
    disabled: false,
    carshow: false,
    timeshow: false,
    content: [],
    time_content: ['一个月', '两个月', '三个月', '半年', '一年'],
    month:1,
    car_index: 0,
    time_index: 0,
    time: '一个月',
    car: '自行车',
    home_code: '',
    car_type: '',
    search: 1,
    search_txt:[],
  },
  selectcar() {
    this.setData({ carshow: true })
  },
  time() {
    this.setData({ timeshow: true })
  },
  onClose() {
    this.setData({ carshow: false });
  },
  timeClose() {
    this.setData({ timeshow: false });
  },
  car_change(e) {
    var value = e.detail.value;
    for (var index in this.data.content.ruleVos[1].carTypes) {
      if (this.data.content.ruleVos[1].carTypes[index] == value) {
        this.setData({
          car_index: index,
          car: value,
          carshow: false
        })
      }
    }
  },
  time_change(e) {
    var value = e.detail.value;
    for (var index in this.data.time_content) {
      if (this.data.time_content[index] == value) {
        var month = Number(index) + 1;
        if (month == 4) { month = 6 }
        if (month == 5) { month = 12 }
        this.setData({
          time_index: index,
          time: value,
          timeshow: false,
          month
        })
      }
    }
  },
  // 搜索框
  search(){
    this.setData({
      search: 2,
      search_txt: []
    })
  },
  //搜索
  onSearch(e){
    var that = this
    netWork.GET({
      url: '/carbarn/' + e.detail,
      params:{},
      success(res){
        that.setData({
          search_txt: res.data.data
        })
      }
    })
  },
  onblur(e){
    this.setData({
      search: 1
    })
  },
  // 搜索完成
  confirm(e){
    var location = e.currentTarget.dataset.content;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    if(location == ''){location = this.data.location}
    this.setData({
      location,
      search: 1,
      id,
      content: this.data.search_txt[index]
    })
  },
  //判断是否阅读规定
  state(e) {
    if (this.data.disabled) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  home_code(e) {
    var home_code = e.detail.value
    this.setData({ home_code })
  },
  car_type(e) {
    var car_type = e.detail.value
    this.setData({ car_type })
  },
  //支付
  pay() {
    var local = this.data.location;
    var paytype = 2
    if (this.data.disabled) {
      var home_code = this.data.home_code;
      var car_type = this.data.car_type
      if (!home_code || !car_type) {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
      } else if (local == '请选择车库'){
        wx.showToast({
          title: '请选择车库',
          icon: 'none'
        })
      } else{
        var carType = this.data.car_index + 1
        var timetype = this.data.month
        var brand = this.data.car_type
        var roomNum = this.data.home_code
        netWork.POST({
          url: '/order',
          params: {
            brand,
            amount: timetype,
            roomNum,
            carBarnId: 1,
            carType: 1,
            parkingType: 2
          },
          success(res) {
            var pay = res.data.data.wxpayorder
            var order = res.data.data.order
            //调起支付
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
                  url: '/orders/' + order.orderId,
                  params: {},
                  success(res) {
                  }
                })
              }
            })
          }
        })
      }
    } else {
      wx.showToast({
        title: '请仔细阅读规定',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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