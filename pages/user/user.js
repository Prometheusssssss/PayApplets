// pages/user/user.js
const app = getApp()
const { base64 } = global;
var isonShow;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    imageUrl:'',
    tmpPath:'',
    // isPic : false,
    isManager:false,
    isLoginUser: false,
    imageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20201016-a8035ddb-f0f9-4417-a772-27f7b30559d2/image',
    zanImageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20201016-bc73298c-340c-4dfe-90b1-74f360a63266/image',
    showConfirmAuthorization:false,

    isRegeister:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var that = this;
  },

  onShow: function(){
    var that = this;
    if (isonShow) {//添加弹框在预览图片
      isonShow= false;
      return;
    };
    if(app.getUser() !=undefined && app.getUser() != null){
      that.setData({isLoginUser:true,userInfo: app.getUser()})
    }else{
      that.setData({isLoginUser:false})
    }
    
  },
  loadUserInfo:function(){
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
            isLoginUser : true,
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
              isLoginUser : false,
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
          showConfirmAuthorization:true
        })
      } else {
        //用户按了拒绝按钮
        that.setData({
          isLoginUser:false,
          userInfo:{},
          showConfirmAuthorization:false
        })
      }
  },
  cancel:function(){
    var that = this;
    that.setData({showConfirmAuthorization:false})
  },
  previewImage: function () {
    var that = this;
    isonShow = true;
    wx.previewImage({
      current: that.data.imageUrl, // 当前显示图片的http链接
      urls: [that.data.imageUrl]// 需要预览的图片http链接列表
    })
  },
  previewZanImage:function(){
    var that = this;
    isonShow = true;
    wx.previewImage({
      current: that.data.zanImageUrl, // 当前显示图片的http链接
      urls: [that.data.zanImageUrl]// 需要预览的图片http链接列表
    })
  },
  //联系客服
  handleContact :function(e) {
  },
 
  editUser:function(){
    var that = this;
    wx.navigateTo({
      url: `change-info`,
    })
  },
  goNodeRecordPage:function(){
    wx.navigateTo({
      url: 'node-record',
    })
  },
  goUrlPage:function(){
    wx.navigateTo({
      url: '../test/test',
    })
  },
  onShareAppMessage: function () {

  }
})