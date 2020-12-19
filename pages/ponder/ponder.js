const app = getApp()
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
    selectStatus: '星运计算', //状态
    selectType: '星运计算', //状态，

    curentPonderArr:[],
    expectPonderArr:[],
    ponderLevelArr:['2级精工','3级精工'],

    curentPonderIndex: 0,
    expectPonderIndex: 0,
    ponderLevelIndex:0,
    price: '',
    ponderInfo:{}
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
    var numArr = ['请选择等级'];
    for(var i=11;i<61;i++){
      var value = i.toString()
      numArr.push(value)
    }
    that.setData({
      curentPonderArr: numArr,
      expectPonderArr : numArr
    })
  },

  bindCurrenPonderChange: function (e) {
    var that = this;
    that.setData({
      curentPonderIndex: e.detail.value
    })
  },
  bindExpectPonderChange: function (e) {
    var that = this;
    that.setData({
      expectPonderIndex: e.detail.value
    })
  },
  bindPonderLevelChange: function (e) {
    var that = this;
    that.setData({
      ponderLevelIndex: e.detail.value
    })
  },
  
  savePonderValue:function(e){
    var that = this;
    var data = that.data;
    var valueInfo = e.detail.value;
    var starClickTimes = wx.getStorageSync("starClickTimes") || 0;
    if (common.validators.isInValidNum(valueInfo.price, '精装价格')) {
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
    const nowLevel = data.curentPonderArr[data.curentPonderIndex] == '请选择等级' ? '' : data.curentPonderArr[data.curentPonderIndex];
    const preLevel = data.expectPonderArr[data.expectPonderIndex] == '请选择等级' ? '' : data.expectPonderArr[data.expectPonderIndex];
    var jingongLevel =  '';
    if(data.ponderLevelArr[data.ponderLevelIndex] == '2级精工'){
      jingongLevel = '2'
    }else{jingongLevel='3'}
    var p = {
      "nowLevel": nowLevel,
      "preLevel": preLevel,
      "jingongLevel": jingongLevel,
      "price": valueInfo.price
    }
    app.ManageExecuteApi('/api/_pondering/sumPondering', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.setData({ponderInfo : dataList})
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
      title: "分享琢磨计算", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/ponder/ponder`, // 默认是当前页面，必须是以‘/’开头的完整路径
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