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

    favorabilityList:[],
    showConfirmLogin:false,
    favorabilityInfo:{},
    
  },

  onLoad: function(options) {
    var that = this;
    that.lmFramework = that.selectComponent("#lm-framework");
    that.setData({
      userInfo: app.getUser()
    })
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-f4c7ef953a5af766'
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
    var p = {
      "tableName": "B_PARTNER_INTIMACY",
      "page": 1,
      "limit": 10000,
      "filters": [],
    }
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.setData({
          sliderList: dataList,
        })
        if(that.data.currentSliderbar == 1){
          that.setData({
            currentSliderbar: dataList[0].KID,
            currentSliderbarInfo : dataList[0]
          })
        }
        that.loadfavorabilityList()
      }
    })
  },
  loadfavorabilityList:function(){
    var that = this;
    var  filter = [
      {
        "fieldName": "PID",
        "type": "date",
        "compared": "=",
        "filterValue": that.data.currentSliderbar
      }, {
        "fieldName": "NAME",
        "type": "string",
        "compared": "like",
        "filterValue": that.data.searchText
      }]
      var p = {
        "tableName": "v_partner_detail",
        "page": 1,
        "limit": 10000,
        "filters": filter,
        "orderByField": "INTIMACY",
        "isDesc":1
      }
   
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.setData({
          favorabilityList:dataList
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
    that.loadfavorabilityList()
  },
  //普通用户编辑
  edtiCommonAdventure:function(e){
    var that = this;
    var favorabilityInfo = e.currentTarget.dataset.item;
    that.setData({favorabilityInfo: favorabilityInfo})
    var userInfo = that.data.userInfo;
    if(userInfo == undefined || userInfo == null  || userInfo == ''){
      that.setData({showConfirmLogin:true})
     
    }else{
      wx.navigateTo({
        url: `edit-common-detail?favorabilityInfo=${JSON.stringify(favorabilityInfo)}`,
      })
    }
    
  
  },
  getUserInfo: async function(res){
    var that = this;
    if (res.detail.errMsg == 'getUserInfo:ok') {
        //用户按了允许授权按钮
        var data = JSON.parse(res.detail.rawData);
        var nickName = data.nickName;
        var name = nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "") ;
        var code = await app.getJsCode();
        var p = {
          "jsCode": code,
          "name": base64.encode(name),
          "url": data.avatarUrl
        }
        await app.ManageExecuteApi(`/api/_login/doLogin`, '', p, "POST").then((userInfo) => {
          if(userInfo != 'error'){//存入user  跳转页面
            var data = userInfo[0];
            var info = {
              id: data.KID,
              code: data.CODE,
              name: data.NAME,
              url: data.IMG_URL,
              isManager: data.IS_SA
            };
            app.setUser(info)
            that.setData({
              showConfirmLogin : false,
              userInfo: info
            })
            wx.showToast({
              title:'登录成功',
              icon:'none',
              duration: 800
            })
            var favorabilityInfo = that.data.favorabilityInfo;
            setTimeout(()=>{
              wx.navigateTo({
                url: `edit-common-detail?favorabilityInfo=${JSON.stringify(favorabilityInfo)}`,
              })
            },400)
           
            
          }else{
            //重新授权登录
            wx.showToast({
              title:'登录失败',
              icon:'none',
              duration: 800
            })
            that.setData({
              showConfirmLogin : false,
              userInfo:{}
            })
          }
        })
      } else {
        //用户按了拒绝按钮
        that.setData({
          showConfirmLogin:false,
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

    if(that.data.favorabilityList.length>0){
      type = 'edit';
      var favorabilityInfo = {
        RECOMMEND: item.RECOMMEND,
        IMAGE_URL: item.IMAGE_URL,
        NAME:  item.NAME,
        PID: item.PID,
      }
    }else{
      var favorabilityInfo = {
        IMAGE_URL: item.IMAGE_URL,
        NAME:  item.NAME,
        PID: item.KID,
        RECOMMEND: item.RECOMMEND,
      }
    }
    wx.navigateTo({
      url: `edit-manager-detail?favorabilityInfo=${JSON.stringify(favorabilityInfo)}&type=${type}`,
    })
  },
  //查看投稿
  selAllAdventure:function(e){
    
    var favorabilityInfo = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `examine-common-submittion?favorabilityInfo=${JSON.stringify(favorabilityInfo)}`,
    })
  },
  previewImage: function (e) {
    var that = this;
    var imageUrl = e.currentTarget.dataset.item.COORDINATE_URL;
    isonShow = true;
    wx.previewImage({
      current: imageUrl, // 当前显示图片的http链接
      urls: [imageUrl]// 需要预览的图片http链接列表
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "分享伙伴好友度", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/favorability/favorability`, // 默认是当前页面，必须是以‘/’开头的完整路径
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