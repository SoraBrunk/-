// const globalUrl = 'http://47.105.54.204:8090';//test地址
// const domain = '192.168.10.21:8078';
// const domain = '192.168.10.21:8078/mp/v1';
// const domain = '192.168.10.93:8080/mp/v1';
const domain = 'carbarnmpapi.thieldata.com/mp/v1';

const globalUrl = 'https://' + domain;
// const globalUrl = 'http://' + domain;
class Network {
  static domain = domain;
  static url = globalUrl;
  //GET请求
  static GET(requestHandler) {
    this.request('GET', requestHandler)
  }

  //POST请求
  static POST(requestHandler) {
    this.request('POST', requestHandler)
  }

  //DELETE请求
  static DELETE(requestHandler) {
    this.request('DELETE', requestHandler)
  }

  // 请求封装
  static request(method, requestHandler) {
    var params = requestHandler.params;
    var url = requestHandler.url;
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    wx.request({
      url: globalUrl + url,
      data: params,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'MP-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        wx.hideLoading();
        // requestHandler.success(res)
        if (res.statusCode === 200) {
          if (res.data.success) {
            requestHandler.success(res);
          } else {
            requestHandler.success(res);
            // wx.showModal({
            //   content: res.data.msg,
            //   showCancel: false,
            //   confirmColor: '#4482ff',
            //   confirmText: '好的'
            // });
          }
        } else {
        }
      },
      fail: function (res) {
        wx.hideLoading();
        // requestHandler.fail(res);
        wx.showModal({
              content: '系统繁忙请稍后再试',
              showCancel: false
            });
      },
      complete: function () {
        wx.hideLoading();
        // requestHandler.complete(res)
      }
    })
  };
}

module.exports = Network;