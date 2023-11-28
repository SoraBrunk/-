// pages/message/message/message.js
const netWork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    time: '',
    orderType: 3,
    content: {},
    remark: {},
    phone: '028-85594176'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderNum = options.orderNum
    var orderType = orderNum.slice(0, 1)
    if (options.remark){
      var remark = JSON.parse(options.remark)
    }else {
      var remark = ''
    }
    var that = this
    if(orderType == 1){
      netWork.GET({
        url: '/orders/ordernum/' + orderNum,
        params: {},
        success(res){
          that.setData({
            content: res.data.data
          })
        }
      })
    }else if(orderType == 2) {
      netWork.GET({
        url: '/order/charge/' + orderNum,
        params: {},
        success(res) {
          that.setData({
            content: res.data.data
          })
        }
      })
    }
    this.setData({
      time: options.time,
      type: options.type,
      orderType,
      remark
    })
    netWork.POST({
      url: '/msg/' + options.id,
      params: {},
      success(res){
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