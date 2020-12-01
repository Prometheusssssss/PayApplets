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
    currentSliderbarName: '',
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
   
    groupName: '鱼王',
    userInfo :{},
    scrollTop:0,

    fishList:[],
    showConfirmLogin:false,
    fishInfo:{},

    selectStatus:'鱼王',
    showConfirmAuthorization:false,
  },

  onLoad: function(options) {
    var that = this;
    //左侧类别只需要查询一次
    that.loadSliderList();
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
    if(that.data.currentSliderbarName != ''){
      that.loadfishList()
    }
    
  },
  loadSliderList:function(){
    var that = this;
    var  filter = [
      {
        "fieldName": "GROUPS",
        "type": "date",
        "compared": "=",
        "filterValue": that.data.groupName
      }]
    var p = {
      "tableName": "B_FOOD_FISH_CATEGORY",
      "page": 1,
      "limit": 10000,
      "filters": filter
    }
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.setData({
          sliderList: dataList,
        })
        if(dataList.length>0){
          that.setData({
            currentSliderbar: dataList[0].KID,
            currentSliderbarName: dataList[0].NAME,
          })
        }
        if(dataList.length>0){
          that.loadfishList()
        }
      }
    })
  },
  loadfishList:function(){
    var that = this;
    var p = {
      "groups": that.data.groupName,
      "name": that.data.currentSliderbarName,
      "orderByField":"KID",
      "isDesc":0
    }
    app.ManageExecuteApi('/api/_search/postFoodSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        dataList.Table.forEach(item=>{
          if(item.CONTENT != '' && item.CONTENT != null){
            item.IMG_LIST = item.CONTENT.split(',')
          }
        })
        that.setData({fishList:dataList.Table})
      }
    })
  },
  changeCurrentSegment: function (e) {
    var that = this;
    var groupName = e.detail.key;
    that.setData({
      groupName: groupName,
      selectStatus: groupName
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
    that.setData({
      currentSliderbar: detail.KID,
      currentSliderbarName:detail.NAME
    })
    that.loadfishList()
  },
  //普通用户编辑
  edtiCommonfish:function(e){
    var that = this;
    var fishInfo = e.currentTarget.dataset.item;
    that.setData({fishInfo: fishInfo})
    var userInfo = that.data.userInfo;
    if(userInfo == undefined || userInfo == null  || userInfo == ''){
      that.setData({showConfirmLogin:true})
     
    }else{
      wx.navigateTo({
        url: `edit-common-detail?fishInfo=${JSON.stringify(fishInfo)}`,
      })
    }
  },
   //第一次授权
   getPhoneNumber:async function(res) {
    var that = this;
    if (res.detail.errMsg == 'getPhoneNumber:ok') {
      //用户按了允许授权按钮
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


  //和管理员编辑 管理员可以清空推荐人和推荐人id 
  edtiManagerfish:function(e){
    var that = this;
    var fishInfo = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `edit-manager-detail?fishInfo=${JSON.stringify(fishInfo)}`,
    })
  },
  //查看投稿
  selAllfish:function(e){
    
    var fishInfo = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `examine-common-submittion?fishInfo=${JSON.stringify(fishInfo)}`,
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
      title: "分享食材鱼王", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/fish/fish`, // 默认是当前页面，必须是以‘/’开头的完整路径
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