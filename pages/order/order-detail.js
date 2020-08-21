// pages/order/order-detail.js
const app = getApp()
const {
  common
} = global;
var CryptoJS = require("../order/HmacSHA256.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailImageList:[],
    mainImg:'',
    detailInfo:'',
    
    showNeedLoginn:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.detailData)
    
    const detailData =  JSON.parse(options.detailData);
    var imageList = detailData.DESC_PHOTO.split(',');
    
    that.setData({
      mainImg:detailData.PHOTO_URL,
      detailImageList: imageList,
      detailInfo: detailData
    })

  },
  buyProduct:function(){
    var that = this;
    if(app.getUser() !=undefined && app.getUser() != null){
      var detailInfo = that.data.detailInfo;
    //   console.log(detailInfo)
    //   var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    //   console.log(time)
      
    //   var p = {
    //     STATUS: '待发货',
    //     TYPE:'商品',
    //     GAME_PARTITION_KID: detailInfo.GAME_PARTITION_KID,
    //     GAME_PARTITION_NAME: detailInfo.GAME_PARTITION_NAME,
    //     GAME_SECONDARY_KID: detailInfo.GAME_SECONDARY_KID,
    //     GAME_SECONDARY_NAME: detailInfo.GAME_SECONDARY_NAME,
    //     GAME_ZONE_KID: detailInfo.GAME_ZONE_KID,
    //     GAME_ZONE_NAME: detailInfo.GAME_ZONE_NAME,
    //     BUY_USER_ID: app.getUser().id,
    //     BUY_USER_NAME: app.getUser().name,
    //     BUY_USER_PHONE: app.getUser().tel,
    //     SELL_USER_ID: detailInfo.SELL_USER_ID,
    //     SELL_USER_NAME: detailInfo.SELL_USER_NAME,
    //     SELL_USER_PHONE: detailInfo.SELL_USER_PHONE,
    //     PRODUCT_NAME: detailInfo.NAME,
    //     PRODUCT_ID: detailInfo.KID,
    //     PRICE: detailInfo.PRICE,
    //     PHOTO_URL: detailInfo.PHOTO_URL,
    //     DESC_PHOTO: detailInfo.DESC_PHOTO,
    //     NEED_LEVEL: detailInfo.NEED_LEVEL,
    //     DESCRIPTION: detailInfo.DESCRIPTION,
    //     ORDER_TIME: time,
    //   }
    //   console.log(p)
      var p = {
        price: detailInfo.PRICE,
        productId: detailInfo.KID,
        buyUserId: app.getUser().id
      }
      that.createOrder(p)
    }else{
        //弹出登录框
      that.setData({showNeedLoginn:true})
    }
  },
  confirmLogin: function(){
    wx.navigateTo({
      url: '../login/login?isFromPage=1'
    })
  },
  createOrder: async function(p) {
    var that = this;
    console.log(p)
    var data = that.data;
    const timestamp = Math.round(new Date().getTime());
    var totalPayAmount = p.price;
    var productId = p.productId;
    var buyUserId = p.buyUserId;
    var payCode = `JY${timestamp}${app.randomString(8)}`;
    // 一个key  spName 
    var payResult = await app.getPayMent(totalPayAmount, productId,buyUserId,payCode);//接口生成预支付订单
    let paySign = "";
    console.log('payResult')
    console.log(payResult)
    
    const sub_appid = payResult.appId;
    const paySignPackage = payResult.package;
    const signType = 'HMAC-SHA256';
    const nonceStr = app.randomString();
    const subMchKey = '60878661699542A59601575597ED9B59';
    var str = `appId=${sub_appid}&nonceStr=${nonceStr}&package=${paySignPackage}&signType=${signType}&timeStamp=${timestamp}&key=${subMchKey}`;
    paySign = CryptoJS.HmacSHA256(str,subMchKey).toString().toUpperCase();
    
    return await new Promise(r => {
      // wx.hideLoading()
      wx.requestPayment({
        timeStamp: timestamp.toString(),
        nonceStr: nonceStr,
        package: paySignPackage,
        signType: signType,
        paySign: paySign,
        success: function(res) {
          // r(payCode)//返回交易号
          // wx.hideLoading()
          that.afterSubmitOrder(payCode,'success')
        },
        fail: function(res) {
          // wx.hideLoading()
          
          wx.showToast({
            title: '请先支付哦',
            icon: 'none',
            duration: 1500,
          });
        },
      })
    })
    
  },
  afterSubmitOrder: function(payCode,msg) {
    var that = this;
    // var detailSeckillId = that.data.kid;
    setTimeout(() => {
      if(msg =='success'){
        wx.showToast({
          title: "购买成功",
          icon: 'none',
          duration: 1500
        })
      }
      wx.switchTab({
        url: '../user/user'//main-in
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../myBought/myBought'//main-in
        })
        
        setTimeout(() => {
          wx.navigateTo({
            url: `../myBought/myBought-detail?payCode=${payCode}`//main-in
          })
        }, 800)
      }, 600)
    }, 200)
  },

  createOrder1: function (p) {
    console.log('立即购买')

    app.ManageExecuteApi('/api/_cud/createOrder', '', p, 'POST').then((result) => {
      if (result != 'error') {
        wx.showToast({
          title: '购买成功',
          icon: 'none',
          duration: 1500
        })
        var orderItem = result.Table[0];
        //我买到的
        setTimeout(() => {
          wx.switchTab({
            url: '../user/user'//main-in
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '../myBought/myBought'//main-in
            })
            
            setTimeout(() => {
              wx.navigateTo({
                url: `../myBought/myBought-detail?orderItem=${JSON.stringify(orderItem)}`//main-in
              })
            }, 800)
          }, 600)
        }, 200)
      }else{
        setTimeout(() => {
          wx.navigateBack({
            delta:1
          })
        }, 400)
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
 
})