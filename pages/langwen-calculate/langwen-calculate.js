const app = getApp()
// pages/customerOrder/customerOrder.js
const { common,base64 } = global;
let videoAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalList: [],
    defaultPageSize: app.getPageSize(),
    searchText: '',
    selectStatus: '金色琅玟', //状态

  //  goldenLwArr:['【天】星源','【天】穹宇','【地】竹川'],//琅玟
   goldenLwArr:[],//琅玟
   goldenLevelArr:[1,2,3,4,5,6,7,8,9,10],//等级
   goldenNumArr:[1,2,3,4,5,6,7,8,9,10,11,12],//数量
   goldenLwIndex: 0,
   goldenLevelIndex: 0,
   goldenNumIndex: 0,
   goldenCurrentInfo:{},

   shopLwArr:[],//琅玟
   shopLevelArr:[1,2,3,4,5,6,7,8,9,10],//等级
   shopNumArr:[1,2,3,4,5,6,7,8,9,10,11,12],//数量
   shopLwIndex: 0,
   shopLevelIndex: 0,
   shopNumIndex: 0,
   shopCurrentInfo:{},

   pointPrice: 450,

   clickTimes:0,
  },
  // var clickTimes = 0;
  //选择相同则不计算
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-c44ea80ff9e3dd8b'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
    }
    
  },
  onShow: function () {
    var that = this;
    //取数组值
    that.loadGoldenLwArr()
    that.loadShopLwArr()
  },
 
  loadGoldenLwArr:function(){
    var that = this;
    var p = {
      "tableName":"b_gold_langwen",
      "page": 1,
      "limit": 10000,
      "filters":[],
      "orderByField":"SEQ_NO",
      "isDesc":0
    }
    
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        var lwArr = [' '];
        dataList.forEach(item=>{
          lwArr.push(item.NAME)
        })
        that.setData({
          goldenLwArr: lwArr
        })
      }
    })

    // var p = {}//提现人的账户余额
    // var url = `/api/_search/defaultSearch/b_gold_langwen?filter=${JSON.stringify(p)}`;
    // app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
    //   if (dataList != 'error') {
    //     var lwArr = [' '];
    //     dataList.forEach(item=>{
    //       lwArr.push(item.NAME)
    //     })
    //     that.setData({
    //       goldenLwArr: lwArr
    //     })
    //   }
    // })

  },

  loadShopLwArr:function(){
    var that = this;
    // SEQ_NO
    var p = {
      "tableName":"sel_purple_langwen",
      "page": 1,
      "limit": 10000,
      "filters":[],
      "orderByField":"SEQ_NO",
      "isDesc":0
    }
    
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        var lwArr = [' '];
        dataList.forEach(item=>{
          lwArr.push(item.NAME)
        })
        that.setData({
          shopLwArr: lwArr
        })
      }
    })
  },

  bindGoldenLwChange: function (e) {
    var that = this;
    that.setData({
      goldenLwIndex: e.detail.value
    })
  },
  bindGoldenLevelChange: function (e) {
    var that = this;
    that.setData({
      goldenLevelIndex: e.detail.value
    })
  },
  bindGoldenNumChange: function (e) {
    var that = this;
    that.setData({
      goldenNumIndex: e.detail.value
    })
  },

  bindShopLwChange: function (e) {
    var that = this;
    that.setData({
      shopLwIndex: e.detail.value
    })
  },
  bindShopLevelChange: function (e) {
    var that = this;
    that.setData({
      shopLevelIndex: e.detail.value
    })
  },
  bindShopNumChange: function (e) {
    var that = this;
    that.setData({
      shopNumIndex: e.detail.value
    })
  },
  bindPointInput:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      pointPrice : value
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
  //金色琅玟计算  确认计算三次后 触发激励广告 
  saveGoldenValue:function(e){
    var that = this;
    var result = e.detail.value;
    var data = that.data;
    var clickTimes = wx.getStorageSync("clickTimes") || 0;
    if (common.validators.isInValidNum(result.pointPrice, '钥匙评价价格') || common.validators.isEmptyText(data.goldenLwArr[data.goldenLwIndex], '琅玟')) {
      return;
    }
    
    clickTimes += 1;
    //计算次数超时需要看广告才可以
    if(clickTimes > 15){
      // 用户触发广告后，显示激励视频广告
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd.load()
            .then(() => {
              videoAd.show();//重新拉取
            })
            .catch(err => {
              // '激励视频 广告显示失败'
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
      wx.setStorageSync('clickTimes',clickTimes)
    }
    
   
    var p = {
      "name": data.goldenLwArr[data.goldenLwIndex],
      "level":"LEVEL_"+data.goldenLevelArr[data.goldenLevelIndex],
      "num": data.goldenNumArr[data.goldenNumIndex],
      "price": Number(result.pointPrice)
    }
    app.ManageExecuteApi('/api/_langwen/goldSelect', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.setData({
         goldenCurrentInfo: dataList
        })
        wx.showToast({
          title: '计算成功',
          icon:'none',
          duration: 1500
        })
      }
    })


  },
  saveShopValue:function(e){
    var that = this;
    var result = e.detail.value;
    var data = that.data;
    var clickTimes = wx.getStorageSync("clickTimes") || 0;
    if (common.validators.isEmptyText(data.shopLwArr[data.shopLwIndex], '琅玟')) {
      return;
    }

    clickTimes += 1;
    //计算次数超时需要看广告才可以
    if(clickTimes > 15){
      // 用户触发广告后，显示激励视频广告
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd.load()
            .then(() => {
              videoAd.show();//重新拉取
            })
            .catch(err => {
              // '激励视频 广告显示失败'
            })
        })
        videoAd.onClose((res) => {
          // 用户点击了【关闭广告】按钮
          if (res && res.isEnded) {
            // 正常播放结束，可以下发游戏奖励
            wx.setStorageSync('clickTimes',0)
            return
          } else {
            wx.setStorageSync('clickTimes',0)
            return
            // 播放中途退出，不下发游戏奖励 返回不给执行逻辑 return
          }
        })
      }
    }else{
      wx.setStorageSync('clickTimes',clickTimes)
    }
    // b_purple_langwen
    var p = {
      "name": data.shopLwArr[data.shopLwIndex],
      "level":data.shopLevelArr[data.shopLevelIndex],
      "num": data.shopNumArr[data.shopNumIndex],
    }
    app.ManageExecuteApi('/api/_langwen/purpleSelect', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.setData({
         shopCurrentInfo: dataList
        })
        wx.showToast({
          title: '计算成功',
          icon:'none',
          duration: 1500
        })
      }
    })

  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "分享琅纹计算", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/langwen-calculate/langwen-calculate`, // 默认是当前页面，必须是以‘/’开头的完整路径
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