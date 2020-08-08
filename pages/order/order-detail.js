// pages/order/order-detail.js
const app = getApp()
const {
  common
} = global;
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
      console.log(detailInfo)
      var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
      console.log(time)
      
      var p = {
        STATUS: '待发货',
        TYPE:'商品',
        GAME_PARTITION_KID: detailInfo.GAME_PARTITION_KID,
        GAME_PARTITION_NAME: detailInfo.GAME_PARTITION_NAME,
        GAME_SECONDARY_KID: detailInfo.GAME_SECONDARY_KID,
        GAME_SECONDARY_NAME: detailInfo.GAME_SECONDARY_NAME,
        GAME_ZONE_KID: detailInfo.GAME_ZONE_KID,
        GAME_ZONE_NAME: detailInfo.GAME_ZONE_NAME,
        BUY_USER_ID: app.getUser().id,
        BUY_USER_NAME: app.getUser().name,
        BUY_USER_PHONE: app.getUser().tel,
        SELL_USER_ID: detailInfo.SELL_USER_ID,
        SELL_USER_NAME: detailInfo.SELL_USER_NAME,
        SELL_USER_PHONE: detailInfo.SELL_USER_PHONE,
        PRODUCT_NAME: detailInfo.NAME,
        PRODUCT_ID: detailInfo.KID,
        PRICE: detailInfo.PRICE,
        PHOTO_URL: detailInfo.PHOTO_URL,
        DESC_PHOTO: detailInfo.DESC_PHOTO,
        NEED_LEVEL: detailInfo.NEED_LEVEL,
        DESCRIPTION: detailInfo.DESCRIPTION,
        ORDER_TIME: time,
      }
      console.log(p)
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
  createOrder: function (p) {
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
  //立即购买前是不是需要添加买家信息！！！
  // buyProduct: async function(){
  //   var that = this;
  //   var that = this;
  //   var data = that.data;
  //   wx.showLoading({
  //     title: '加载中...',
  //     mask: true,
  //   })
  //   if (app.getUser().subMchId == '') {//商户号
  //     wx.hideLoading()
  //     wx.showToast({
  //       title: "请联系商家配置支付商户号",
  //       icon: 'none',
  //       duration: 2000
  //     });
  //     return 'failed';
  //   }
  //   const timestamp = Math.round(new Date().getTime());
  //   var totalPayAmount = that.data.totalPayAmount;
  //   var payCode = `YX${timestamp}${app.randomString(8)}`;//秒杀
  //   var json = {
  //     // id: data.kid,//秒杀kid
  //     // crt_code: app.getUser().code,//创建人code
  //     // cid: app.getUser().cid,//cid
  //     // address: data.currentAddress.KID,//客户信息收货地址id
  //     // userid: app.getUser().id,//客户信息id
  //     // store_id: app.getStore().KID,//门店id
  //     // time: data.time,//送达时间
  //     // remark: data.remark,//备注
  //     // submerchant_id: app.getUser().subMchId,//商户号
  //     // payCode: payCode, //交易号
  //     // orderNum: data.orderNum, //订购数量
  //     // totalPayAmount:data.totalPayAmount,//总金额（包含运费）（订单数量*秒杀价格 + 运费）
  //     // orderAmount: data.orderAmount,//订购总额
  //     // freight: data.freight //运费 
  //   }

  //   var p = {
  //     P_KEY: payCode,
  //     P_VALUE: JSON.stringify(json),
  //   }

  //   var createResult = await app.CrudCreate('pay_parameter', p);
  //   console.log('pay_parameter表的Result')
  //   console.log(createResult)
  //   if (createResult != 'error') {
  //     // 一个key  spName 
  //     var spName = 'create_seckill_order_sjn';
  //     var payResult = await app.getPayMent(totalPayAmount, payCode, '打字吧下单',spName);//接口生成预支付订单
  //     let paySign = "";
  //     console.log('payResult')
  //     console.log(payResult)
  //     const sub_appid = payResult.sub_appid;
  //     const paySignPackage = payResult.package;
  //     const signType = 'HMAC-SHA256';
  //     const nonceStr = app.randomString();
  //     const subMchKey = app.getUser().subMchKey;
  //     var str = `appId=${sub_appid}&nonceStr=${nonceStr}&package=${paySignPackage}&signType=${signType}&timeStamp=${timestamp}&key=${subMchKey}`;
  //     paySign = CryptoJS.HmacSHA256(str,subMchKey).toString().toUpperCase();
      
  //     return await new Promise(r => {
  //       wx.hideLoading()
  //       wx.requestPayment({
  //         timeStamp: timestamp.toString(),
  //         nonceStr: nonceStr,
  //         package: paySignPackage,
  //         signType: signType,
  //         paySign: paySign,
  //         success: function(res) {
  //           // r(payCode)//返回交易号
  //           that.afterSubmitOrder(payCode,'success')
  //         },
  //         fail: function(res) {
  //           that.cancelRedisTask();
  //           wx.showToast({
  //             title: '请先支付哦',
  //             icon: 'none',
  //             duration: 1500,
  //           });
  //         },
  //       })
  //     })
  //   }
  // }
 
})