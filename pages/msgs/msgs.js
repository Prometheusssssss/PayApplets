const app = getApp()
// pages/msgs/msgs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [], //消息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getMsgData();
  },

  //加载数据
  getMsgData: function () {
    var that = this;
    var p = {
      "USER_ID": "1"
    }
    var url = `/api/_search/defaultSearch/b_message?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          msgList: result,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})