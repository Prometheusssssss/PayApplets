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
    userInfo:{},
    msgList:[],
    payCode:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.orderItem){
      var orderItem = JSON.parse(options.orderItem);
      console.log('orderUtem')
      console.log(orderItem)
      that.setData({orderItem:orderItem,userInfo:app.getUser()})
      that.sellerMsg()
    }else if(options.payCode){
      that.setData({payCode: options.payCode})
      that.loadOrder()
    }
   

  },
  //加载订单
  loadOrder:function(){
    var that = this;
    var p = {
      CODE: that.data.payCode
    }
    var url = `/api/_search/defaultSearch/b_order?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
      if (dataList != 'error') {
        that.setData({
          orderItem: dataList[0]
        })
        that.sellerMsg()
      }
    })
  },
  onShow: function () {
    var that = this;
    that.sellerMsg()

  },
  //卖家的留言
  sellerMsg:function(){
    var that = this;
    var data = that.data;
    var p = {
      ORDER_ID: data.orderItem.KID,
      // SEND_USER_ID:  data.orderItem.SELL_USER_ID,
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
  // 留言之后往对应的接收方发送一条系统消息，您有新的留言待查看，并且订单的消息子表里插入对应的消息内容
  // ORDER_ID SEND_ID SEND_NAME CONTENT PHOTO RECEIVE_ID RECEIVE_NAME 接收方是卖家
  leaveMsgToSeller:function(){
    var that = this;
    var orderItem = that.data.orderItem;
    var receiveInfo = {
      receiveId: orderItem.SELL_USER_ID,
      receiveName: orderItem.SELL_USER_NAME,
      receivePhone: orderItem.SELL_USER_PHONE,
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
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },


})