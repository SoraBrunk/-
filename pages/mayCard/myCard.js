// pages/mayCard/myCard.js
const netWork = require('../../utils/network.js')
Component({

  /**
   * 页面的初始数据
   */
  data: {
    order: ''
  },
  methods:{
    //查看详情
    details(e){
      var id = e.currentTarget.dataset.id
      var detail = this.data.order[id]
      wx.navigateTo({
        url: '../cardDetails/cardDetails?orderNum='+ detail.orderNum,
      })
    },
    add(){
      wx.navigateTo({
        url:'../card/card'
      })
    },
    onload(){
      var that = this
      netWork.POST({
        url: '/orders/user',
        params: {},
        success(res){
          that.setData({
            order: res.data.data
          })
        }
      })
    }
  },
  ready(){
   this.onload()
  }
})