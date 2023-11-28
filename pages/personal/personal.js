// pages/personal/personal.js
const wechat = require('../../utils/wechat.js')
const netWork = require('../../utils/network.js')
Component({

  /**
   * 页面的初始数据
   */
  data: {
    message:'',
    image:'',
    userName: '',
    user:{},
    servePhone: '028-85594176'
  },
  methods:{
    message(){
      wx.navigateTo({
        url: '../message/messageCenter/messageCenter',
      })
    },
    person(){
      wx.navigateTo({
        url: '../set/set?detail='+ JSON.stringify(this.data.user),
      })
    },
    help(){
      wx.navigateTo({
        url: '../help/help',
      })
    },
    getUser(){
      var that = this
      netWork.GET({
        url: '/user',
        params: {},
        success(res){
          var message = res.data.data.unRead
          if (message == 0){message = ''}
          that.setData({
            user: res.data.data,
            message
          })
        }
      })
    },
    call(){
      var pho = this.data.servePhone;
      wx.makePhoneCall({
        phoneNumber: pho //仅为示例，并非真实的电话号码
      })
    }
  },
  ready(){
    this.getUser()
    wechat.getUserInfo()
    var user = wx.getStorageSync('user')
    this.setData({
      image: user.avatarUrl,
      userName: user.nickName
    })
  }
})