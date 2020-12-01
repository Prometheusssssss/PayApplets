// pages/langwen-simulation/langwen-add-times.js
const app = getApp()
const {
  common
} = global;
var CryptoJS = require("../public-js/HmacSHA256.js");
let videoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectList:[{
      KID:1,
      TIMES: '1次',
      COUT_NUMBER:1,
      PRICE: '查看广告',
      IS_PRICE: false,
      IS_NEED_PAY: false,
    }],
    selectInfo:{},
    canShowAd: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
    
    // 如何判断小程序中播放激励视频是否超过限制
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-cb5cfaaf13cef6fb'
      })
      videoAd.onLoad(() => {})

      videoAd.onError((err) => {
        // 该用户不会展示广告
        wx.showToast({
          title: '观看广告机会已用完',
          icon:'none',
          duration:2000
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var user = app.getUser();
    if(user == undefined || user == null){
      that.setData({isLogin:false})
    }else{
      that.setData({
        userInfo: app.getUser()
      })
    }
    var count = wx.getStorageSync('showRewardedVideoAdCount');
    var maxCount = app.globalData.maxShowRewardedAdCount;
    if(app.isAndriod()){
      var selectList = [];
      if(count < maxCount){
        selectList = [{
          KID:1,
          TIMES: '1次',
          COUT_NUMBER:1,
          PRICE: '查看广告',
          IS_PRICE: false,
          IS_NEED_PAY: false,
        },{
          KID:2,
          TIMES: '20次',
          COUT_NUMBER: 20,
          PRICE: 9.9,
          IS_PRICE: true,
          IS_NEED_PAY: true,
        },{
          KID:3,
          TIMES: '50次',
          COUT_NUMBER:50,
          PRICE: 19.9,
          IS_PRICE: true,
          IS_NEED_PAY: true,
        },{
          KID:4,
          TIMES: '永久可用',
          COUT_NUMBER:999,
          PRICE: 49.9,
          IS_PRICE: true,
          IS_NEED_PAY: true,
        },];
        that.setData({selectInfo:selectList[1]})
      }else{
        selectList = [{
          KID:1,
          TIMES: '20次',
          COUT_NUMBER: 20,
          PRICE: 9.9,
          IS_PRICE: true,
          IS_NEED_PAY: true,
        },{
          KID:2,
          TIMES: '50次',
          COUT_NUMBER:50,
          PRICE: 19.9,
          IS_PRICE: true,
          IS_NEED_PAY: true,
        },{
          KID:3,
          TIMES: '永久可用',
          COUT_NUMBER:999,
          PRICE: 49.9,
          IS_PRICE: true,
          IS_NEED_PAY: true,
        }];
        that.setData({selectInfo:selectList[0]})
      }
      that.setData({
        selectList:selectList,
      })
    }else{
      if(count<maxCount){
        that.setData({
          selectInfo:that.data.selectList[0]
        })
      }else{
        that.setData({
          selectList: []
        })
      }
    }
  },
  choose: function(e){
    var that = this;
    var item = e.currentTarget.dataset.item;
    that.setData({selectInfo : item})
  },
  submit: async function(p) {
    var that = this;
    var data = that.data;
    if(data.selectInfo.KID == undefined){
      wx.showToast({
        title: '请先选择对应的次数',
        icon:'none',
        duration:2000
      })
      return
    }else{
      //一种是付款获得，回调里用户次数会增加，最后是可以直接返回给我最新的用户次数
      if(data.selectInfo.IS_NEED_PAY){
        //付款金额  userId(就可以吧 jscode应该不用的 可能会失效) 次数AVALIABLE_TIMES 是否永久IS_PERMANENT
        if(app.isAndriod()){
          var p = {
            price: data.selectInfo.PRICE,
            buyNum: data.selectInfo.COUT_NUMBER,
            buyUserId: app.getUser().id
          }
          const timestamp = Math.round(new Date().getTime());
          var totalPayAmount = p.price;
          var buyNum = p.buyNum;
          var buyUserId = p.buyUserId;
          var payCode = `JY${timestamp}${app.randomString(8)}`;
          // 一个key  spName 
          var payResult = await app.getPayMent(totalPayAmount, buyNum,buyUserId,payCode);//接口生成预支付订单
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
            wx.requestPayment({
              timeStamp: timestamp.toString(),
              nonceStr: nonceStr,
              package: paySignPackage,
              signType: signType,
              paySign: paySign,
              success: function(res) {
                that.afterSubmitOrder('success')
              },
              fail: function(res) {
                wx.showToast({
                  title: '请先支付哦',
                  icon: 'none',
                  duration: 1500,
                });
              },
            })
          })
        }else{
          wx.showToast({
            title: 'ios暂不支持',
            icon:'none',
            duration:2000
          })
        }
        
      }else{//一种是看广告必须看完了才能获得次数，更新user表里的次数字段；；
        //拉取广告 看完了才能去更新用户的次数 update
        var count = wx.getStorageSync('showRewardedVideoAdCount');
        var maxCount = app.globalData.maxShowRewardedAdCount;
        if(count < maxCount){
          if (videoAd) {
            videoAd.show().catch(() => {
              // 失败重试
              videoAd.load()
                .then(() => {
                  videoAd.show();//重新拉取
                })
                .catch(err => {
                  //次数达到上限之后
                  wx.showToast({
                    title: '观看广告机会已用完',
                    icon:'none',
                    duration:2000
                  })
                })
            })
            videoAd.onClose((res) => {
              if (res && res.isEnded) {
                // 正常播放结束，更新用户次数
                var newCount = parseInt(count) + 1;//大概可能这里加完就要去对比是不是用完了

                wx.setStorage({
                 key: 'showRewardedVideoAdCount',
                 data: newCount,
                });
                var time = new Date()
                time = time.getTime();
                // 更新保存的时间
                wx.setStorage({
                 key: 'saveVideoAdCountTime',
                 data: time
                });
                that.addCountNumber()
              } else {
                wx.showToast({
                  title: '观看结束才能获得次数',
                  icon:'none',
                  duration:2000
                })
              }
            })
          }
        }else{
          //已经没有次数了
          wx.showToast({
            title: '观看广告机会已用完',
            icon:'none',
            duration:2000
          })
          that.setData({canShowAd: false})
          if(app.isAndriod()){
            var selectList = [];
            selectList = [{
              KID:1,
              TIMES: '20次',
              COUT_NUMBER: 20,
              PRICE: 9.9,
              IS_PRICE: true,
              IS_NEED_PAY: true,
            },{
              KID:2,
              TIMES: '50次',
              COUT_NUMBER:50,
              PRICE: 19.9,
              IS_PRICE: true,
              IS_NEED_PAY: true,
            },{
              KID:3,
              TIMES: '永久可用',
              COUT_NUMBER:999,
              PRICE: 49.9,
              IS_PRICE: true,
              IS_NEED_PAY: true,
            }];
            that.setData({selectInfo:selectList[0]})
            that.setData({
              selectList:selectList,
            })
          }else{
            that.setData({
              selectList: [],
              selectInfo:{}
            })
          }
        }
        

      }
    }
  },
  addCountNumber:function(){
    var that = this;
    var countNumber = that.data.userInfo.countNumber;
    var newCountNumber = Number(countNumber) + 1;
    var p = {
      KID:  app.getUser().id,
      COUNT_NUMBER: newCountNumber
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/a_user', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.loadUserInfo()
      }
    })
  },
  loadUserInfo:function(){
    var that = this;
    var p = {"KID": app.getUser().id}
    var url = `/api/_search/defaultSearch/a_user?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
      if (dataList != 'error') {
        console.log('观看成功')
        wx.showToast({
          title: '可用次数+1',
          icon:'none',
          duration:3000
        })
        var info = {
          id: dataList[0].KID,
          code: dataList[0].CODE,
          name: dataList[0].NAME,
          url: dataList[0].IMG_URL,
          isManager: dataList[0].IS_SA,
          tel: dataList[0].PHONE,
          isPermanent: dataList[0].IS_PERMANENT,
          countNumber: dataList[0].COUNT_NUMBER,
        };
        app.setUser(info)
        that.setData({userInfo: info})
      }
    })
  },
  afterSubmitOrder: function(status){
    var that = this;
    if(status == 'success'){
      that.updateLoadUser()
    }
  },
  updateLoadUser:function(){
    var that = this;
    var p = {"KID": app.getUser().id}
    var url = `/api/_search/defaultSearch/a_user?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
      if (dataList != 'error') {
          var info = {
            id: dataList[0].KID,
            code: dataList[0].CODE,
            name: dataList[0].NAME,
            url: dataList[0].IMG_URL,
            isManager: dataList[0].IS_SA,
            tel: dataList[0].PHONE,
            isPermanent: dataList[0].IS_PERMANENT,
            countNumber: dataList[0].COUNT_NUMBER,
          };
        app.setUser(info)
        that.setData({userInfo: info})
      }
    })
  },
})