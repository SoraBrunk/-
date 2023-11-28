// pages/photo/photo.js
const netWork = require('../../utils/network.js')
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: '',
    cardNum: '未识别',
    img: '',
    buttonStyle: 'button bind',
    show : false,
    reset: ''
  },
  img(){
    var that = this;
    var access_token = that.data.access_token;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        wx.showLoading({
          title: '识别中',
        })
        var image = res.tempFilePaths[0];
        that.urlTobase64(res.tempFilePaths[0]).then((img)=>{
          wx.request({
            url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/numbers',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              access_token,
              image: img,
              detect_direction: true
            },
            async success(res){
              console.log(res);
              wx.hideLoading()
              if (res.data.words_result_num !== 0){
                var world = res.data.words_result
                await world.forEach((item,index,arr)=>{
                  if (item.words.length>9) {
                    that.setData({
                      cardNum: item.words.length > 10 ? item.words.substr(1, 10) : item.words,
                      img: image,
                      buttonStyle: 'button'
                    })
                  }
                })
                if (that.data.cardNum === '未识别') {
                  wx.showModal({
                    title: '提示',
                    content: '未识别到正确卡号',
                    showCancel: false
                  })
                }
              } else {
                wx.showModal({
                  title: '提示',
                  content: '识别失败',
                  showCancel: false
                })
              }
            },
            fail(res){
              wx.showModal({
                title: '提示',
                content: '识别失败',
                showCancel: false
              }) 
              that.setData({
                cardNum: '未识别',
                buttonStyle: 'button bind'
              })
            }
          })
        })
      },
    })
  },
  urlTobase64(url) {
    var fs = wx.getFileSystemManager()
    return new Promise((resolve, reject)=>{
      fs.readFile({
        filePath: url,
        encoding: 'base64',
        success(res) {
          resolve(res.data)
        }
      })
    })

  },
  open(){
    this.setData({ show: true })
  },
  // onBlur(e){
  //   this.setData({ reset: e.detail.value })
  // },
  onChange(){
    if (this.data.reset.length > 9) {
       this.setData({ cardNum : this.data.reset})
    }else {
      wx.showToast({
        title: '输入的卡号不符合规则',
        icon: 'none',
        duration: 1000
      })
    }
  },
  onClose(){
    // this.setData({ show: false })
  },
  next(){
    var cardNum = this.data.cardNum;
    if(cardNum == '未识别'){
      // wx.showToast({
      //   title: '请先进行卡片识别',
      //   icon: 'none'
      // })
    }else {
      netWork.POST({
        url: '/card/order',
        params: {
          cardId: cardNum
        },
        success(res){
          var success = res.data.success
          if (success){
            if (res.data.data.carBarnId) {
              var data = res.data.data
              wx.showModal({
                title: '提示',
                content: '您尚未拥有订单，请点击确定创建新订单进行绑定',
                showCancel: true,
                success(res) {
                  if (res.confirm) {
                    data = JSON.stringify(data)
                    wx.redirectTo({
                      url: '/pages/payMent/payMent?data=' + data,
                    })
                  }
                }
              })
            } else {
              Toast({
                type: 'success',
                message: '绑定成功',
                onClose: () => {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            }
          }else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
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
    var that = this
    const grant_type = 'client_credentials'
    // const client_id = 'rpc5HhS3NCvglLhmCg0IaEDr'
    // const client_secret = 'PfrRNXo95hdB73RNymNKFhSj7CGCqUBT'
    const client_id = 'wByviZOFmedN3KwDgXPaT83K'
    const client_secret = 'pGxXhFbWSm3PyNrXGXRzjgsY79ko6u5V'
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
      method: 'POST',
      success(res){
        that.setData({
          access_token: res.data.access_token
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