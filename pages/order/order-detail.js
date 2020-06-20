// pages/order/order-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailImageList:[],
    mainImg:'',
    detailInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.detailData)
    
    const detailData =  JSON.parse(options.detailData);
    var imageList = detailData.DETAIL_IMG.split(',');
    // debugger
    that.setData({
      mainImg:detailData.MAIN_IMG,
      detailImageList: imageList,
      detailInfo: detailData
    })

  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //立即购买前是不是需要添加买家信息！！！
  buyProduct: async function(){
    var that = this;
    var that = this;
    var data = that.data;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    if (app.getUser().subMchId == '') {//商户号
      wx.hideLoading()
      wx.showToast({
        title: "请联系商家配置支付商户号",
        icon: 'none',
        duration: 2000
      });
      return 'failed';
    }
    const timestamp = Math.round(new Date().getTime());
    var totalPayAmount = that.data.totalPayAmount;
    var payCode = `YX${timestamp}${app.randomString(8)}`;//秒杀
    var json = {
      // id: data.kid,//秒杀kid
      // crt_code: app.getUser().code,//创建人code
      // cid: app.getUser().cid,//cid
      // address: data.currentAddress.KID,//客户信息收货地址id
      // userid: app.getUser().id,//客户信息id
      // store_id: app.getStore().KID,//门店id
      // time: data.time,//送达时间
      // remark: data.remark,//备注
      // submerchant_id: app.getUser().subMchId,//商户号
      // payCode: payCode, //交易号
      // orderNum: data.orderNum, //订购数量
      // totalPayAmount:data.totalPayAmount,//总金额（包含运费）（订单数量*秒杀价格 + 运费）
      // orderAmount: data.orderAmount,//订购总额
      // freight: data.freight //运费 
    }

    var p = {
      P_KEY: payCode,
      P_VALUE: JSON.stringify(json),
    }

    var createResult = await app.CrudCreate('pay_parameter', p);
    console.log('pay_parameter表的Result')
    console.log(createResult)
    if (createResult != 'error') {
      // 一个key  spName 
      var spName = 'create_seckill_order_sjn';
      var payResult = await app.getPayMent(totalPayAmount, payCode, '打字吧下单',spName);//接口生成预支付订单
      let paySign = "";
      console.log('payResult')
      console.log(payResult)
      const sub_appid = payResult.sub_appid;
      const paySignPackage = payResult.package;
      const signType = 'HMAC-SHA256';
      const nonceStr = app.randomString();
      const subMchKey = app.getUser().subMchKey;
      var str = `appId=${sub_appid}&nonceStr=${nonceStr}&package=${paySignPackage}&signType=${signType}&timeStamp=${timestamp}&key=${subMchKey}`;
      paySign = CryptoJS.HmacSHA256(str,subMchKey).toString().toUpperCase();
      
      return await new Promise(r => {
        wx.hideLoading()
        wx.requestPayment({
          timeStamp: timestamp.toString(),
          nonceStr: nonceStr,
          package: paySignPackage,
          signType: signType,
          paySign: paySign,
          success: function(res) {
            // r(payCode)//返回交易号
            that.afterSubmitOrder(payCode,'success')
          },
          fail: function(res) {
            that.cancelRedisTask();
            wx.showToast({
              title: '请先支付哦',
              icon: 'none',
              duration: 1500,
            });
          },
        })
      })
    }
  }

})