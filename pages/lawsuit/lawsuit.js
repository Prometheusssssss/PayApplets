// pages/order/order-slider.js
const app = getApp();
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

    sliderList: [],
    currentSliderbar: 1,
    currentSliderbarInfo: {},
    searchText: '',

    hasPicker:false,
    currentSliderbarChangeId: "",
    isPicker:false,
    userInfo :{},
    scrollTop:0,

   lawsuitList:[],
   showConfirmLogin:false,
   lawsuitInfo:{},
    
  lawsuitGroupList:[{
      KID:1,
      NAME:'县衙恶犯',
      PARENT_ID:0,
    },{
      KID:2,
      NAME:'州府要犯',
      PARENT_ID:0,
    },{
      KID:3,
      NAME:'朝廷钦犯',
      PARENT_ID:0,
    },{
      KID:4,
      NAME:'疑案寻踪',
      PARENT_ID:0,
    }],
    groupName: '县衙恶犯',
  },

  onLoad: function(options) {
    var that = this;
    that.lmFramework = that.selectComponent("#lm-framework");
    that.setData({
      userInfo: app.getUser()
    })
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-683fc4bc264a0f93'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
    }
  },
  onShow:function(){
    var that = this;
    if (isonShow) {//添加弹框在预览图片
      isonShow= false;
      return;
    };
    that.loadSliderList();
    
  },
  loadSliderList:function(){
    var that = this;
    // if(that.data.groupName != '全部'&&that.data.groupName != ''){
      var  filter = [{
        "fieldName": "GROUPS",
        "type": "date",
        "compared": "=",
        "filterValue": that.data.groupName
      }]
    // }
    
    var p = {
      "tableName": "b_duanan_category",
      "page": 1,
      "limit": 10000,
      "filters": filter,
    }
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
          that.setData({
            sliderList: dataList,
          })
          if(dataList.length>0){
            that.loadLawsuitList()
          }
      }
    })
  },
  changeSecondCategory: function (e) {
    var that = this;
    var groupName = e.currentTarget.dataset.item;
    that.setData({
      groupName: groupName
    })
    var  filter = [{
      "fieldName": "GROUPS",
      "type": "date",
      "compared": "=",
      "filterValue": groupName
    }]
  var p = {
    "tableName": "b_duanan_category  ",
    "page": 1,
    "limit": 10000,
    "filters": filter,
  }
  app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
    if (dataList != 'error') {
        that.setData({
          sliderList: dataList,
        })
        if(dataList.length>0){
          that.setData({
            currentSliderbar: dataList[0].KID,
            currentSliderbarInfo : dataList[0]
          })
        }
        if(dataList.length>0){
          that.loadLawsuitList()
        }
    }
  })
  },
  loadLawsuitList:function(){
    var that = this;
    var  filter = [
      {
        "fieldName": "CATEGORY_ID",
        "type": "date",
        "compared": "=",
        "filterValue": that.data.currentSliderbar
      }]
    var p = {
      "tableName": "v_duanan_detail",
      "page": 1,
      "limit": 10000,
      "filters": filter
    }
   
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.setData({
         lawsuitList:dataList
        })
      }
    })
  },

  searchList:function({
    detail
  }){
    var that = this;
    that.setData({searchText:detail})
    //搜索
  },
 
  // 切换slider滚动到指定位置
  changeSliderBar: function({
    detail
  }) {
    var that = this;
    var clickTimes = wx.getStorageSync("clickTimes") || 0;
    clickTimes += 1;
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
            wx.setStorageSync('clickTimes',0);
          } else {
            wx.setStorageSync('clickTimes',0)
            // 播放中途退出，不下发游戏奖励 返回不给执行逻辑 return
          }
        })
      }
    }else{
      wx.setStorageSync('clickTimes',clickTimes)
    }
    var currentSliderInfo = that.data.sliderList.find(slider=>slider.KID == detail.KID);
    that.setData({
      currentSliderbar: detail.KID,
      currentSliderbarInfo:currentSliderInfo
    })
    that.loadLawsuitList()
  },
  //普通用户编辑
  edtiCommonAdventure:function(e){
    var that = this;
    var lawsuitInfo = e.currentTarget.dataset.item;
    that.setData({lawsuitInfo:lawsuitInfo})
    var userInfo = that.data.userInfo;
    if(userInfo == undefined || userInfo == null  || userInfo == ''){
      that.setData({showConfirmLogin:true})
     
    }else{
      wx.navigateTo({
        url: `edit-common-detail?lawsuitInfo=${JSON.stringify(lawsuitInfo)}`,
      })
    }
    
  
  },

  cancelDoLogin:function(){
    var that = this;
    that.setData({showConfirmLogin:false})
  },


  //和管理员编辑 管理员可以清空推荐人和推荐人id 
  edtiManagerAdventure:function(e){
    var that = this;
    var item = e.currentTarget.dataset.item;
    var type = 'add';
    if(that.data.lawsuitList.length>0){
      type = 'edit';
      var lawsuitInfo = {
        CONTENT: item.CONTENT,
        NAME:  item.NAME,
        PID: item.CATEGORY_ID,
      }
    }else{
      var lawsuitInfo = {
        CONTENT: '',
        NAME:  item.NAME,
        PID: item.KID
      }
    }
    wx.navigateTo({
      url: `edit-manager-detail?lawsuitInfo=${JSON.stringify(lawsuitInfo)}&type=${type}`,
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "分享捕快断案", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/lawsuit/lawsuit`, // 默认是当前页面，必须是以‘/’开头的完整路径
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