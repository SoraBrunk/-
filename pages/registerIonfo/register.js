// pages/registerIonfo/register.js
const netWork = require('../../utils/network.js')
const reg = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    phoneNumber: '',
    time: 60,
    interval: '',
    check: '',
    checknum: ''
  },
  // 验证码
  getMessage(s){
    var that =this
    var time = 60
    var phone = that.data.phoneNumber
    if (phone){
      if(reg(phone)){
        wx.showToast({
          title: '已发送短信',
          icon:'none',
          success(){
            netWork.POST({
              url: '/authcode/' + phone,
              success(res){
                if (res.data.success) {
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
                } else {
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
      }else {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
      }
    }else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }
  },
  // 输入信息
  change(e){
    let type = e.currentTarget.dataset.type
    let num = e.detail.value
    if(type == 1){
      this.setData({
        userName: num
      })
    }else if (type == 2){
      this.setData({
        phoneNumber: num 
      })
    }else {
      this.setData({
        check: num
      })
    }
  },
  // 下一步 
  next(e){
    let username = this.data.userName;
    let phone = this.data.phoneNumber;
    let check = this.data.check
    let checknum = this.data.checknum
    if(e.detail.rawData){
      if(!username || !phone || !check){
        wx.showToast({
          title: '请填写完整信息',
          icon:'none'
        })
      }else {
        if(check == checknum){
          netWork.POST({
            url:'/users',
            params:{
              authCode: check,
              phone,
              userName: username
            },
            success(res){
              if (res.data.success){
                  wx.redirectTo({
                  url: '../uploadFace/upLoadFace'
                })
              }else {
                wx.showToast({
                  title: '验证码已失效，或数据库异常',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }else {
          wx.showToast({
            title: '请输入正确验证码',
            icon: 'none'
          })
        }
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