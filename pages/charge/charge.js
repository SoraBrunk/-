// pages/charge/charge.js
const app = getApp()
const netWork = require('../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress_txt: '26', 
    content: {}
  },
  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg', this)
    ctx.setLineWidth(15);// 设置圆环的宽度
    ctx.setStrokeStyle('#EBECF1'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(131, 131, 120, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress', this);
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#73DBC4");
    gradient.addColorStop("0.5", "#40ED94");
    gradient.addColorStop("1.0", "#73DBC4");

    context.setLineWidth(15);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(131, 131, 120, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    netWork.GET({
      url: '/orders/charge/' + app.globalData.deviceSn,
      params: {
      },
      success(res) {
        that.setData({
          content: res.data.data
        })
        var num1 = that.data.content.chargeTime
        var num2 = that.data.content.payTime
        var num3 = ((num1 / num2).toFixed(2)) * 2
        num3 = num3.toFixed(1)
        that.drawProgressbg();
        that.drawCircle(num3) 
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