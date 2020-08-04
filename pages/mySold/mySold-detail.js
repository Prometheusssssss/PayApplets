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
    that.buyerMsg()
  },
   //买家的留言
   buyerMsg:function(){
    var that = this;
    var data = that.data;
    var p = {
      ORDER_ID: data.orderItem.KID,
      // SEND_USER_ID:  data.orderItem.BUY_USER_ID,
    }//提现人的账户余额
    var url = `/api/_search/defaultSearch/b_order_msg_details?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
      var msgList = []
      if (dataList != 'error') {
        dataList.forEach(item=>{
          msgList.push({
            sendName:item.SEND_USER_NAME,
            content: item.CONTENT,
            imgUrls: item.PHOTO_URLS.split(','),
            createTime: item.CRT_TIME
          })
        })
        that.setData({msgList:msgList})
        
      }
    })
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
  leaveMsgToBuyer:function(){
    var that = this;
    var orderItem = that.data.orderItem;
    var receiveInfo = {
      receiveId: orderItem.BUY_USER_ID,
      receiveName: orderItem.BUY_USER_NAME,
      receivePhone: orderItem.BUY_USER_PHONE,
      orderId: orderItem.KID,
      orderCode: orderItem.CODE
    }
    //给卖家留言 
    wx.navigateTo({
      url: `../common-page/leave-msg?receiveInfo=${JSON.stringify(receiveInfo)}`,
    })
  },
  showImg: function (e) {
    var that = this;
    var item = e.target.dataset.item;
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      urls: item.imgUrls,
      current: item.imgUrls[index]
    })
  },
})