const app = getApp()
// pages/customerOrder/customerOrder.js
const { common,base64 } = global;
var isonShow;
let videoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalList: [],
    defaultPageSize: app.getPageSize(),
    searchText: '',
    selectStatus: '星运计算', //状态
    selectType: '星运计算', //状态，

    starCalArr:['贪狼','紫薇','破军','天同','七煞'],
    starConvertArr:['贪狼','紫薇','破军','天同','七煞'],

    curentStarCal:{},
    curentStarConvert:{},

    curentStarCalIndex: 0,
    curentStarConvertIndex: 0,

    li:'',
    lv:'',
    ren:'',
    kuang:'',

    tuopuImageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20201014-d5aaa297-4f90-4872-99ff-a3274c36f58f/image'
  },
  //选择相同则不计算
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.lmFramework = that.selectComponent("#lm-framework");
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-99f8f5033eeb39f6'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
    }
  },
  onShow: function () {
    var that = this;
    if (isonShow) {//添加弹框在预览图片
      isonShow= false;
      return;
    };
    // that.lmFramework.dealPageNoSize('enter');
  },
  callBackPageSetData: function (e) {
    var that = this;
    that.setData(e.detail.returnSetObj)
  },
  //订单页面方法开始
  loadMainList: function (e) {
    var {
      pageNo,
      pageSize,
      type
    } = e.detail;
    var that = this;
    var data = that.data;
    var filter = [];
    var selectType = data.selectType;
    if (selectType == '全部') {
      filter = [{
          "fieldName": "PRODUCT_NAME,BUY_USER_PHONE,SELL_USER_PHONE,CODE",
          "type": "string",
          "compared": "like",
          "filterValue": data.searchText
        },
        {
          "fieldName": "STATUS",
          "type": "date",
          "compared": "=",
          "filterValue": data.selectStatus
        },
      ];
    } else {
      filter = [{
        "fieldName": "PRODUCT_NAME,BUY_USER_PHONE,SELL_USER_PHONE,CODE",
        "type": "string",
        "compared": "like",
        "filterValue": data.searchText
      },
      {
          "fieldName": "STATUS",
          "type": "date",
          "compared": "=",
          "filterValue": data.selectStatus
        },
        {
          "fieldName": "TYPE",
          "type": "date",
          "compared": "=",
          "filterValue": selectType
        }
      ]
    }
    // isDesc 1代表倒序，0代表正序
    var p = {
      "tableName": "b_order",
      "page": pageNo,
      "limit": pageSize,
      "filters": filter,
      "orderByField": "ORDER_TIME",
      "isDesc":1
    }
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.lmFramework.dealWithList(type, dataList, pageSize);
      }
    })
  },

  bindSartCalChange: function (e) {
    var that = this;
    that.setData({
      curentStarCalIndex: e.detail.value
    })
  },
  bindStarConvertChange: function (e) {
    var that = this;
    that.setData({
      curentStarConvertIndex: e.detail.value
    })
  },
  liInput:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      li : value
    })
  },
  lvInput:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      lv : value
    })
  },
  renInput:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      ren : value
    })
  },
  kuangInput:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      kuang : value
    })
  },
  changeCurrentSegment: function ({
    detail
  }) {
    var that = this;
    that.setData({
      selectStatus: detail.key
    })
  },
  saveStarCalValue:function(e){
    var that = this;
    var data = e.detail.value;
    var starClickTimes = wx.getStorageSync("starClickTimes") || 0;
    if (common.validators.isInValidNum(data.li, '厉') ||
      common.validators.isInValidNum(data.lv, '律') ||
      common.validators.isInValidNum(data.ren, '仁') ||
      common.validators.isInValidNum(data.kuang, '狂')) {
      return;
    }
    starClickTimes += 1;
    //计算次数超时需要看广告才可以
    if(starClickTimes > 15){
      // 用户触发广告后，显示激励视频广告
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd.load()
            .then(() => {
              videoAd.show();//重新拉取
            })
            .catch(err => {
              // 激励视频 广告显示失败
            })
        })
        videoAd.onClose((res) => {
          // 用户点击了【关闭广告】按钮
          if (res && res.isEnded) {
            // 正常播放结束，可以下发游戏奖励
            wx.setStorageSync('starClickTimes',0)
          } else {
            wx.setStorageSync('starClickTimes',0)
            // 播放中途退出，不下发游戏奖励 返回不给执行逻辑 return
          }
        })
      }
    }else{
      wx.setStorageSync('starClickTimes',starClickTimes)
    }
    var p = {
      "li": data.li,
      "ren": data.ren,
      "lv": data.lv,
      "kuang": data.kuang
    }
    app.ManageExecuteApi('/api/_star/calculation', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        var startName = dataList.C_NAME;
        var index = that.data.starCalArr.findIndex(item=> item == startName);
        that.setData({
          curentStarCal: dataList,
          curentStarCalIndex: index
        })
        wx.showToast({
          title: '计算成功',
          icon:'none',
          duration: 1500
        })
      }
    })


  },
  saveStarConvertValue:function(e){
    var that = this;
    var data = that.data;
    var starCalArr = data.starCalArr;//星运计算
    var starConvertArr = data.starConvertArr;//星运计算
    var curentStarCalIndex = data.curentStarCalIndex;
    var curentStarConvertIndex = data.curentStarConvertIndex;
    var starClickTimes = wx.getStorageSync("clickTimes") || 0;
    if(starCalArr[curentStarCalIndex] == starConvertArr[curentStarConvertIndex]){
      wx.showToast({
        title: '当前星运 不能和 转换星运相同',
        icon:'none',
        duration:3000
      })
      return
    }else{
      starClickTimes += 1;
      //计算次数超时需要看广告才可以
      if(starClickTimes > 15){
        // 用户触发广告后，显示激励视频广告
        if (videoAd) {
          videoAd.show().catch(() => {
            // 失败重试
            videoAd.load()
              .then(() => {
                videoAd.show();//重新拉取
              })
              .catch(err => {
                // 激励视频 广告显示失败
              })
          })
          videoAd.onClose((res) => {
            // 用户点击了【关闭广告】按钮
            if (res && res.isEnded) {
              // 正常播放结束，可以下发游戏奖励
              wx.setStorageSync('clickTimes',0)
            } else {
              wx.setStorageSync('clickTimes',0)
              // 播放中途退出，不下发游戏奖励 返回不给执行逻辑 return
            }
          })
        }
      }else{
        wx.setStorageSync('clickTimes',starClickTimes)
      }
      var before = starCalArr[curentStarCalIndex];
      var after = starConvertArr[curentStarConvertIndex];
      var p = {
        "before": before,
        "after": after
      }
      app.ManageExecuteApi('/api/_star/changePhase', '', p, 'POST').then((dataList) => {
        
        if (dataList != 'error') {
          that.setData({
            curentStarConvert: dataList
          })
          wx.showToast({
            title: '计算成功',
            icon:'none',
            duration: 1500
          })
        }
      })
    }

  },

  previewTuopuImage:function(){
    var that = this;
    isonShow = true;
    wx.previewImage({
      current: that.data.tuopuImageUrl, // 当前显示图片的http链接
      urls: [that.data.tuopuImageUrl]// 需要预览的图片http链接列表
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "分享星运计算", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/star-luck/star-luck`, // 默认是当前页面，必须是以‘/’开头的完整路径
      // imageUrl: tempath,
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: "分享成功~"
          })
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () { }
    }
    return shareObj;
  },
})