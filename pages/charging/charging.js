// pages/charging/charging.js
import lottie from 'lottie-miniprogram'
const lottieData = require('../../json/data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.createSelectorQuery().select('#canvas').node(res => {
      const canvas = res.node
      const context = canvas.getContext('2d')
      canvas.width = 300//设置宽高，也可以放到wxml中的canvas标签的style中
      canvas.hight = 300
      lottie.setup(canvas)//要执行动画，必须调用setup,传入canvas对象

      lottie.loadAnimation({//微信小程序给的接口，调用就完事了，原理不太懂
        loop: true,//是否循环播放（选填）
        autoplay: true,//是否自动播放（选填）s
        animationData: lottieData.charging,//lottie json包的网络链接，可以防止小程序的体积过大，要注意请求域名要添加到小程序的合法域名中
        rendererSettings: {
          context//es6语法：等同于context:context（必填）
        }
      })
    }).exec()
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
    var a = 'a861b8';
    function hex2int(hex) {
      var len = hex.length, a = new Array(len), code;
      for (var i = 0; i < len; i++) {
        code = hex.charCodeAt(i);
        if (48 <= code && code < 58) {
          code -= 48;
        } else {
          code = (code & 0xdf) - 65 + 10;
        }
        a[i] = code;
      }

      return a.reduce(function (acc, c) {
        acc = 16 * acc + c;
        return acc;
      }, 0);
    }
    a = hex2int(a).toString(10)
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