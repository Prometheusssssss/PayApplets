// pages/customerOrder/customerOrder-detail.js
const app = getApp()
const {
  common
} = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderItem : '',
    showConfirmOff:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderItem = JSON.parse(options.orderItem);
    console.log('orderUtem')
    console.log(orderItem)
    that.setData({orderItem:orderItem})

  },
  onShow: function () {
    var that = this;
    // that.loadDetail()
  },
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
     //准备复制的数据
      data: that.data.orderItem.CODE,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  //交易关闭 更新订单状态为已关闭
  closeOrder:function(){
    var that = this;
    that.setData({
      showConfirmOff:true
    })
    
  },
  confirmOff:function(){
    var that = this;
    var p = {
      KID: that.data.orderItem.KID,
      STATUS: '交易关闭',
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_order', '', p, 'POST').then((result) => {
      if (result != 'error') {
        //更新订单
        wx.showToast({
          title: '交易关闭成功',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          ['orderItem.STATUS']:'交易关闭',
          showConfirmOff:false
        })
        // that.lmFramework.dealPageNoSize('enter');
      }
    })
  }
  // loadDetail: function(){
  //   var that = this;
  //   var orderItem = that.data.orderItem;
  //   加载明细表
  // }
})