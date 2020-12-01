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

    // 移花/天香/唐门 太白/丐帮/神威
   professionList :['移花','天香','唐门','太白','丐帮','神威'],//职业
  //  stageList: ['中前期(1-10)','中后期'],//等级
   goldDegreeList:['普通(<300)','小氪(＜1W)','中氪(＜5W)','大氪(＞5W)'],//氪金度
   professionIndex: 0,
   stageIndex: 0,
   goldDegreeIndex: 0,
   recommondCurrentList:[],
   remark:''
  },
  //选择相同则不计算
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-f5e4d282499a3fe2'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
    }
    
  },
  onShow: function () {
    var that = this;
  },
 

  bindProfessionChange: function (e) {
    var that = this;
    that.setData({
      professionIndex: e.detail.value
    })
  },
  bindStageChange: function (e) {
    var that = this;
    that.setData({
      stageIndex: e.detail.value
    })
  },
  bindGoldenDegreeChange: function (e) {
    var that = this;
    that.setData({
      goldDegreeIndex: e.detail.value
    })
  },

  //  确认计算三次后 触发激励广告 
  saveValue:function(e){
    var that = this;
    var result = e.detail.value;
    var data = that.data;
    var clickTimes = wx.getStorageSync("clickTimes") || 0;
    if (common.validators.isEmptyText(data.professionList[data.professionIndex], '职业')||
    common.validators.isEmptyText(data.goldDegreeList[data.goldDegreeIndex], '氪金度')) {
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
      "zhiye": data.professionList[data.professionIndex],
      "kejin": data.goldDegreeList[data.goldDegreeIndex]
    }
    app.ManageExecuteApi('/api/_langwen/langwenRecommend', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        wx.showToast({
          title: '计算成功',
          icon:'none',
          duration:1500
        })
        that.setData({
          recommondCurrentList:dataList.list,
          remark: dataList.remark
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
      title: "分享琅纹推荐", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/langwen-recommend/langwen-recommend`, // 默认是当前页面，必须是以‘/’开头的完整路径
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