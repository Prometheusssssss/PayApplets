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
    showConfirmOff:false,
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderItem = JSON.parse(options.orderItem);
    console.log('orderUtem')
    console.log(orderItem)
    that.setData({orderItem:orderItem,userInfo:app.getUser()})

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
  //
  closeOrder:function(){
    var that = this;
    that.setData({
      showConfirmOff:true
    })
    
  },
  //交易关闭 发送信息给卖家买家 
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
        that.sendMsgToBuyer(that.data.orderItem)
        that.sendMsgToSell(that.data.orderItem)
        that.setData({
          ['orderItem.STATUS']:'交易关闭',
          showConfirmOff:false
        })
        // that.lmFramework.dealPageNoSize('enter');
      }
    })
  },
  sendMsgToBuyer:function(order){
    var that = this;
    var item = order;
    // debugger
    //先插入消息表吧  给买家发消息 
    var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    var p = {
      THEME:'交易关闭提醒',
      USER_ID: item.BUY_USER_ID,
      USER_NAME: item.BUY_USER_NAME,
      USER_PHONE: item.BUY_USER_PHONE,
      CONTENT: "您拍下的宝贝“"+item.PRODUCT_NAME+"”交易关闭，请注意。",//商品名称
      STATUS: "已发送",
      SEND_TIME: time
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_message', '', p, 'POST').then((result) => {   
      if (result != 'error') {
    
      }
    })

  },
  sendMsgToSell:function(order){
    var that = this;
    var item = order;
    // debugger
    //先插入消息表吧  给买家发消息 
    var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    var p = {
      THEME:'交易关闭提醒',
      USER_ID: item.SELL_USER_ID,
      USER_NAME: item.SELL_USER_NAME,
      USER_PHONE: item.SELL_USER_PHONE,
      CONTENT: "您卖出的宝贝“"+item.PRODUCT_NAME+"”交易关闭，请注意。",//商品名称
      STATUS: "已发送",
      SEND_TIME: time
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_message', '', p, 'POST').then((result) => {   
      if (result != 'error') {
    
      }
    })

  },
  // loadDetail: function(){
  //   var that = this;
  //   var orderItem = that.data.orderItem;
  //   加载明细表
  // }
})