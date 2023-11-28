// pages/set/set.js
const netWork = require('../../utils/network.js')
const wechat = require('../../utils/wechat.js')
const reg = require('../../utils/utils.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: 123,
    pic: '',
    time: 60,
    interval: '',
    checknum: '',
    num: ''
  },
  getMessage(s) {
    var that = this
    var time = 60
    var phone = that.data.phone
    if (phone) {
      if (reg(phone)) {
        wx.showToast({
          title: '已发送短信',
          icon: 'none',
          success() {
            netWork.POST({
              url: '/authcode/' + phone,
              success(res) {
                if(res.data.success){
                  that.setData({
                    checknum: res.data.data
                  })
                  that.setData({
                    interval: setInterval(function () {
                      time--;
                      if (time == 0) {
                        clearInterval(that.data.interval)
                        that.setData({
                          time: 60
                        })
                      } else {
                        that.setData({
                          time
                        })
                      }
                    }, 1000)
                  })
                }else {
                  wx.showModal({
                    title: '提示',
                    content: '获取验证码失败，请24小时后重试',
                    showCancel: false
                  })
                }
              }
            })
       
          }
        })
      } else {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }
  },
  change(e){
    var id = e.currentTarget.dataset.id
    if (id == 0){ this.setData({name: e.detail.value}) }
    if (id == 1){ this.setData({phone: e.detail.value}) }
    if (id == 2) { this.setData({ num: e.detail.value }) }
  },
  reup(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //图片尺寸
      sourceType: ['camera'], //图片来源
      success(res) {
        // wx.showLoading({
        //   title: '请稍后',
        // });
        var tempFilesSize = res.tempFiles[0].size;
        if (tempFilesSize <= 2000000) {   //图片小于或者等于2M时 可以执行获取图片
          wechat.upload(res.tempFilePaths[0], 1).then((key) => {
            that.setData({
              pic: res.tempFilePaths[0]
            })
          }
          )
        } else {    //图片大于2M，弹出一个提示框
          wx.showToast({
            title: '上传图片不能大于2M!',  //标题
            icon: 'none'       //图标 none不使用图标，详情看官方文档
          })
        }
 
      },
      fail: function () {
      }
    })
  },
  save(){
    let username = this.data.name;
    let phone = this.data.phone;
    let check = this.data.num;
    let checknum = this.data.checknum;
    if (!username || !phone || !check) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
    } else {
      if (check == checknum) {
        netWork.POST({
          url: '/users',
          params: {
            authCode: check,
            phone,
            userName: username
          },
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              success(){
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        })
      } else {
        wx.showToast({
          title: '请输入正确验证码',
          icon: 'none'
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var detail = JSON.parse(options.detail)
    this.setData({
      name: detail.userName,
      phone: detail.phone,
      pic: detail.avatar
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