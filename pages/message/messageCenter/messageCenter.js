// pages/message/messageCenter/messageCenter.js
const netWork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    content: [],
    txt: '',
    msg: []
  },
  onSearch(e){
    var txt = e.detail
    this.message(txt)
  },
  message(txt){
    var that = this;
    netWork.GET({
      url: '/msgs' ,
      params: {
        title: txt
      },
      success(res){
        that.setData({
          content: res.data.data
        })
      }
    })
  },
  // 跳转显示信息
  showMessage(e){
    var orderNum = e.currentTarget.dataset.ordernum;
    var id = e.currentTarget.dataset.id
    var time = e.currentTarget.dataset.time;
    var type = e.currentTarget.dataset.type;
    var remark  = e.currentTarget.dataset.remark
    if(type == '充电消息'){
      wx.navigateTo({
        url: '/pages/message/message/message?orderNum=' + orderNum + '&&time=' + time + '&&type=' + type + '&&remark=' + remark + '&&id=' + id,
      })
    }else {
    wx.navigateTo({
      url: '/pages/message/message/message?orderNum=' + orderNum + '&&time=' + time + '&&type='+ type + '&&id=' + id,
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
    var txt = this.data.txt
    this.message(txt)
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