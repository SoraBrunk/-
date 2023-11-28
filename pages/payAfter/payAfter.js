// pages/payAfter/payAfter.js
const netWork = require('../../utils/network.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: '',
    show: false,
    type: 2
  },

  onClickHide() {
    this.setData({ show: false });
  },
  // 退卡
  refund(){
    this.setData({ show: true })
  },
  //退卡跳转
  confirm(){
    var orderId = this.data.order.orderId;
    netWork.POST({
      url: '/pay/refund/'+ orderId,
      params: {},
      success(res){
        wx.showToast({
          title: '退款完成，请稍后刷新卡片',
          icon: 'none',
          success(){
            // app.globalData.carBarnId = undefined
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
              // ({
              //   url: '/pages/tabbar/tabbar',
              // })
            },500)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId
    var that = this
    netWork.GET({
      url: '/orders/id/'+ orderId,
      params: {},
      success(res){
        that.setData({
          order: res.data.data,
          type: res.data.data.parkingTypeStr
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