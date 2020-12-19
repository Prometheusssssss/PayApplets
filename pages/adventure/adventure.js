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
    currentSliderbar: 0,
    currentSliderbarName: '',//全部就是''
    searchText: '',

    hasPicker:false,
    currentSliderbarChangeId: "",
    areaId:'',
    regionId:'',
    serverId:'',
    areaIndex:'',
    regionIndex:'',
    serverIndex:'',
    isPicker:false,
    // '天命风流','江湖轶事','闲情偶遇','侠影迷踪','大宋锦鲤'
    //考虑一下是不是横着类别存到数据库里好做维护
    adventureGroupList:[{
      KID:0,
      NAME:'全部',
      PARENT_ID:0,
    },{
      KID:1,
      NAME:'天命风流',
      PARENT_ID:0,
    },{
      KID:2,
      NAME:'江湖轶事',
      PARENT_ID:0,
    },{
      KID:3,
      NAME:'闲情偶遇',
      PARENT_ID:0,
    },{
      KID:4,
      NAME:'侠影迷踪',
      PARENT_ID:0,
    },{
      KID:5,
      NAME:'大宋锦鲤',
      PARENT_ID:0,
    }],
    groupName: '天命风流',

    userInfo :{},
    scrollTop:0,

    adventureList:[],
    showConfirmLogin:false,
    adventureInfo:{},

    showConfirmAuthorization:false,
  },

  onLoad: function(options) {
    var that = this;
    that.lmFramework = that.selectComponent("#lm-framework");
    that.setData({
      userInfo: app.getUser()
    })
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-072a4f6e6eb6a07e'
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
    var  filter = [{
      "fieldName": "NAME",
      "type": "string",
      "compared": "like",
      "filterValue": that.data.searchText 
    },
      {
        "fieldName": "GROUPS",
        "type": "date",
        "compared": "=",
        "filterValue": that.data.groupName == '全部' ? '' : that.data.groupName
      }]
    var p = {
      "tableName": "B_ADVENTURE_STRATEGY_CATEGORY",
      "page": 1,
      "limit": 10000,
      "filters": filter
    }
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        var allSliderList = []
        if(that.data.groupName != '全部' ){
          allSliderList = [{
            KID:0,
            GROUPS: that.data.groupName,
            NAME: '全部',
          }]
        }else{
          that.setData({
            currentSliderbar : dataList[0].KID,
            currentSliderbarName:dataList[0].NAME,
          })
        }
        that.setData({
          sliderList: allSliderList.concat(dataList),
        })
        
      
        that.loadAdventureList()
      }
    })
  },
  loadAdventureList:function(){
    var that = this;
    var p = {
      "groups": that.data.groupName == '全部' ? '' : that.data.groupName,
      "name": that.data.currentSliderbarName,
      "orderByField":"KID",
      "isDesc":0
    }
    app.ManageExecuteApi('/api/_search/postQiyuSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        dataList.Table.forEach(item=>{
          if(item.COORDINATE_URL != '' && item.COORDINATE_URL != null){
            item.IMG_LIST = item.COORDINATE_URL.split(',')
          }
        })
        that.setData({adventureList:dataList.Table})
      }
    })
  },
  //文本
  searchProductListByText: function (e) {
    var that = this;
    if( e.detail != ''){
      that.setData({
        searchText: e.detail,
        groupName:'全部',
        groupKid: 0,
      })
    }else{
      that.setData({
        searchText: e.detail,
        groupName:'天命风流',
        groupKid: 1,
      })
    }
    
    that.loadSliderList()
  },

  changeSecondCategory: function (e) {
    var that = this;
    var groupName = e.currentTarget.dataset.item;
    that.setData({
      groupName: groupName,
      currentSliderbar : 0,
      currentSliderbarName:'',
    })
    that.loadSliderList()
  },

  // 切换slider滚动到指定位置
  changeSliderBar: function({
    detail
  }) {
    var that = this;
    var id = detail.KID;
    var clickTimes = wx.getStorageSync("clickTimes") || 0;
   
    if(detail.NAME == '全部'){
      detail.NAME = '';
    }else{
      clickTimes += 1;
    }
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
              
            })
        })
        videoAd.onClose((res) => {
          // 用户点击了【关闭广告】按钮
          if (res && res.isEnded) {
            // 正常播放结束，可以下发游戏奖励
            wx.setStorageSync('clickTimes',0);
          } else {
            wx.setStorageSync('clickTimes',0)
          }
        })
      }
    }else{
      wx.setStorageSync('clickTimes',clickTimes)
    }
    // debugger
    that.setData({
      currentSliderbar: detail.KID,
      currentSliderbarName:detail.NAME
    })
    that.loadAdventureList()
  },
  //普通用户编辑
  edtiCommonAdventure:function(e){
    var that = this;
    var adventureInfo = e.currentTarget.dataset.item;
    that.setData({adventureInfo: adventureInfo})
    var userInfo = that.data.userInfo;
    if(userInfo == undefined || userInfo == null  || userInfo == ''){
      that.setData({showConfirmLogin:true})
     
    }else{
      wx.navigateTo({
        url: `edit-common-detail?adventureInfo=${JSON.stringify(adventureInfo)}`,
      })
    }
  },
  //第一次授权
  getPhoneNumber:async function(res) {
    var that = this;
    if (res.detail.errMsg == 'getPhoneNumber:ok') {
      //用户按了允许授权按钮
      // 获取到用户的信息了，打印到控制台上看下
      var data = res.detail;
      var encryptedData = data.encryptedData;
      var iv = data.iv;
      var code = await app.getJsCode();
      var p = {
        "jsCode": code,
        "name": base64.encode(that.data.userInfo.name),
        "url": that.data.userInfo.url,
        "encryptedData": encryptedData,
        "iv": iv,
      }
      await app.ManageExecuteApi(`/api/_login/doLogin`, '', p, "POST").then((userInfo) => {
        if(userInfo != 'error'){//存入user  跳转页面
          var data = userInfo[0];
          var info = {
            id: data.KID,
            code: data.CODE,
            name: data.NAME,
            url: data.IMG_URL,
            isManager: data.IS_SA,
            tel: data.PHONE,
            isPermanent: data.IS_PERMANENT,
            countNumber: data.COUNT_NUMBER,
          };
          app.setUser(info)
          that.setData({
            userInfo: info,
            showConfirmAuthorization:false
          })
          wx.showToast({
            title: '注册成功',
            icon:'none',
            duration:1500
          })
        }else{
          //重新授权登录
          that.setData({
              showConfirmAuthorization:false
          })
          wx.showToast({
            title: '注册失败',
            icon:'none',
            duration:1500
          })
        }
      })
    } else {
      wx.showToast({
        title: '注册解锁更多功能哦~',
        icon:'none',
        duration:1500
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
        var userInfo = {
          name: name,
          url: data.avatarUrl
        }
        that.setData({
          userInfo:userInfo,
          showConfirmLogin:false,
          showConfirmAuthorization:true
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
  cancel:function(){
    var that = this;
    that.setData({showConfirmAuthorization:false})
  },

  //和管理员编辑 管理员可以清空推荐人和推荐人id 
  edtiManagerAdventure:function(e){
    var that = this;
    var adventure = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `edit-manager-detail?adventure=${JSON.stringify(adventure)}`,
    })
  },
  //查看投稿
  selAllAdventure:function(e){
    
    var adventureInfo = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `examine-common-submittion?adventureInfo=${JSON.stringify(adventureInfo)}`,
    })
  },
  previewImage: function (e) {
    var that = this;
    var imageUrl = e.currentTarget.dataset.item.IMG_LIST;
    var index = e.currentTarget.dataset.index;
    isonShow = true;
    wx.previewImage({
      current: imageUrl[index], // 当前显示图片的http链接
      urls: imageUrl// 需要预览的图片http链接列表
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "分享奇遇", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/adventure/adventure`, // 默认是当前页面，必须是以‘/’开头的完整路径
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