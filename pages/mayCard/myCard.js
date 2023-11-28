// pages/mayCard/myCard.js
const netWork = require('../../utils/network.js')
Component({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    expiredOrders: []
  },
  methods:{
    //查看详情
    details(e){
      var id = e.currentTarget.dataset.id;
      var type = e.currentTarget.dataset.type;
      if (type == 1) {
        var detail = this.data.order[id];
      } else {
        var detail = this.data.expiredOrders[id];
      }
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
          var order = res.data.data;
          var effectiveOrders = [];
          var expiredOrders = [];
          order.forEach((item, i, arr)=>{
            if (item.expired) {
              expiredOrders.push(item);
            }else {
              effectiveOrders.push(item);
            }
          })
          that.setData({
            order: effectiveOrders,
            expiredOrders
          })
        }
      })
    }
  },
  ready(){
   this.onload()
  }
})