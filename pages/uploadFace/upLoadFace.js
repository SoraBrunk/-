// const cameraIcon = "https://i.loli.net/2018/11/05/5bdff0b90746e.png";
const netWork = require('../../utils/network.js')
const wechat = require('../../utils/wechat.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosePic: '',
    color: '0',
    tempFilesSize: 0
  },
  /**自定义函数 */
  takePhoto: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //图片尺寸
      sourceType: ['camera'], //图片来源
      success(res) {
        // wx.showLoading({
        //   title: '请稍后',
        // });
        var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B
        that.setData({
          choosePic: res.tempFilePaths[0],
          color: 'color',
          tempFilesSize
        })
        
      },
      fail: function () {
      }
    })
  },
  upload(){
    var pic = this.data.choosePic
    var tempFilesSize = this.data.tempFilesSize
    if(pic == ''){
      wx.showToast({
        title: '请进行拍照',
        icon: 'none'
      })
    }else {
      if (tempFilesSize <= 2000000) {   //图片小于或者等于2M时 可以执行获取图片
        wechat.upload(pic, 0)
      } else {    //图片大于2M，弹出一个提示框
        wx.showToast({
          title: '上传图片不能大于2M!',  //标题
          icon: 'none'       //图标 none不使用图标，详情看官方文档
        })
      }
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
    wx.hideHomeButton()
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