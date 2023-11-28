// pages/cardDetails/cardDetails.js
const netWork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    show: false,
    type: 1,
    payShow: false,
    showMonth: false,
    month: 1,
    columns: ['一个月', '两个月', '三个月', '半年', '一年']
  },
  monthClose() {
    this.setData({ showMonth: false });
  },
  monthSelect() {
    this.setData({ showMonth: true });
  },
  onCancel() {
    this.setData({ showMonth: false });
  },
  monthChoose(event) {
    const { picker, value, index } = event.detail;
    var month = index + 1;
    if (month == 4){
      month = 6;
    }else if (month == 5){
      month = 12;
    }
    this.setData({
      month,
      showMonth: false
    })
  },
  onClickHide() {
    this.setData({ show: false });
  },
  payHide() {
    this.setData({ payShow: false });
  },
  // 退卡
  refund(){
    this.setData({ show: true })
  },
  //退卡跳转
  confirm() { 
    var that = this
    var orderId = this.data.content.orderId;
    netWork.POST({
      url: '/pay/refund/'+ orderId,
      params: {},
      success(res) {
        that.setData({
          show: false
        })
        wx.showToast({
          title: '退款完成，请稍后刷新卡片',
          icon: 'none',
          duration: 2000,
          success() {
            // app.globalData.carBarnId = undefined
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          }
        })
      }
    })
  },
  copyText(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  pay(){
    this.setData({
      payShow: true
    })
  },
  payMoney(){
    var that = this;
    var month = this.data.month;
    var orderNum = this.data.content.orderNum;
    netWork.POST({
      url: '/order/renew',
      params: {
        amount: month,
        orderNum
      },
      success(res) {
        var pay = res.data.data.wxpayorder
        var order = res.data.data.order
        wx.requestPayment({
          timeStamp: pay.timeStamp,
          nonceStr: pay.nonceStr,
          package: pay.packageValue,
          signType: pay.signType,
          paySign: pay.paySign,
          success(res) {
            that.reput(order.orderNum)
          },
          fail(res) {
          }
        })
        // wx.showToast({
        //   title: '退款完成，请稍后刷新卡片',
        //   icon: 'none',
        //   duration: 2000,
        //   success() {
        //     // app.globalData.carBarnId = undefined
        //     setTimeout(function () {
        //       wx.navigateBack({
        //         delta: 1
        //       })
        //     }, 2000)
        //   }
        // })
      }
    })
  },
  reput(orderNum){
    var that = this
    netWork.GET({
      url: '/orders/ordernum/' + orderNum,
      params: {},
      success(res) {
        that.setData({
          content: res.data.data,
          payShow: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderNum = options.orderNum
    this.reput(orderNum)
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