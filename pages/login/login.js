// pages/login/login.js
const app = getApp()
const { common,base64 } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPhoneNumber: wx.canIUse('button.open-type.getPhoneNumber'),
    hasUserInfo: wx.canIUse('button.open-type.getUserInfo'),
    isHide:false,
    userInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
        var that = this;
        //查看是否授权 是否授权过昵称 授权过手机号
      // debugger
      // if(hasUserInfo){
      //   await that.getExistUserInfo()
      // }else{
        
      // }
       
       that.isCodeHasUser();
    
  },
  getExistUserInfo:async function(){
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  isCodeHasUser: async function () {
    var that = this;
    var code = await new Promise(r => {
      wx.login({
        timeout: 2000,
        success(newRes) {
          if (newRes.code) {
            r(newRes.code)
          } else {
            r('')
          }
        }, fail() { r('') },
      })
    })
    console.log('jscode')
    console.log(code)
    // if (code != '') {
    //   var auth = base64.encode(code);
    //   // 把jscode传给后台查给有没有openid对应的手机号 可以把token缓存起来
    //要考虑一下是不是每次授权微信手机号登录的都去新建一条用户 还是用原来旧的匹配
    //   var userInfo= await app.ManageExecuteApi(`/api/security/validusername/kyljscode`, auth, {}, "GET").then((companyList) => {
    //   if(userInfo != 'erro'){//存入user  跳转页面
    //     that.setData({
    //       isHide : true
    //     })
    //   }else{
    //     //重新授权登录
    //     that.setData({
    //       isHide : false
    //     })
    //   }
      

    //   })
    // } else {
    //   setTimeout(() => {
    //     wx.login({
    //       timeout: 2000,
    //       success(newRes) {
    //         if (newRes.code) {
    //           r(newRes.code)
    //         } else {
    //           r('')
    //         }
    //       }, fail() { r('') },
    //     })
    //   }, 400)
    // }
  },
    //第一次授权
  getPhoneNumber: function(res) {
      // debugger;
      if (res.detail.encryptedData) {
        //用户按了允许授权按钮
        var that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的手机号如下：");
        console.log(e.detail.encryptedData);
        //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
        //授权成功后加加密信息和jscode传给后台，后台换回手机号 并且可以注册用户信息（存手机号，用户openid），调用成功后返回用户手机号、userId，userName
        //进入tab页面 
        that.setData({
          isHide: true
        });
  
      } else {
  
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function(res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
   },
  getUserInfo:function(res){
    if (res.detail.encryptedData) {
        //用户按了允许授权按钮
        var that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的手机号如下：");
        console.log(e.detail.encryptedData);
        //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
        //授权成功后加加密信息和jscode传给后台，后台换回手机号 并且可以注册用户信息（存手机号，用户openid），调用成功后返回用户手机号、userId，userName
        //进入tab页面 
  //       that.setData({
  //         hasUserInfo:true,
  //         userInfo:e.detail.encryptedData
  //       })
    
      } else {
  
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function(res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
  }
    
})