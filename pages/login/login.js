// pages/login/login.js
const app = getApp()
const { common,base64 } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canPhoneNumberUse: wx.canIUse('button.open-type.getPhoneNumber'),//当前api在此版在中是否可用
    canUserInfoUse: wx.canIUse('button.open-type.getUserInfo'),
    hasPhoneNumber:false,
    hasUserInfo: false,
    isLogin: true,
    userInfo:{},
    showConfirmAuthorization:false,
    jscode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //优化一下 自动登录和注销后登录都不需要再登录用户的昵称，所以不用每次去检验一下用户信息授权是否还在
 //手动登录注册时会用到用户头像，已有账号登录不会登录用户头像信息
  onLoad: async function(options) {
      var that = this;
      //查看是否授权 是否授权过昵称 授权过手机号
      that.isAuthoraization();
      that.isCodeHasUser();
  },
 
  isAuthoraization:async function(){
    var that = this;
      wx.getSetting({
        success: res=> {
        if (res.authSetting['scope.userInfo']) {
          // debugger
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res=> {
              console.log(res)
              var nickName = res.userInfo.nickName;
              var userInfo = {
                name: nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""),
                url: res.userInfo.avatarUrl
              }
              that.setData({
                userInfo:userInfo,
                hasUserInfo: true
              })
            }
          })
        }else{
          that.setData({
            hasUserInfo: false
          })
        }
      }
    })
  },
  isCodeHasUser: async function () {
    var that = this;
    var code = await app.getJsCode();
    // console.log(code)
    if (code != '') {
      //是否可以自动登录 可以返回给我用户的手机id昵称头像url,不可以跳到用户授权页面，授权注册或者更新
     
      var p = {
        "jsCode": code
      }
      await app.ManageExecuteApi(`/api/_login/doAutoLogin`, '', p, "POST").then((userInfo) => {
        if(userInfo != 'error'){//存入user  跳转页面
          var data = userInfo[0];
          var info = {
            id: data.KID,
            code: data.CODE,
            name: data.NAME,
            url: data.IMG_URL,
            isManager: data.IS_SA,
            tel: data.PHONE,
          };
          app.setUser(info)
          wx.switchTab({
            url: '../order/order',
          })
          // wx.switchTab({
          //   url: '../publish/publish',
          // })
          that.setData({
            isLogin : true
          })
        }else{
          //重新授权登录
          wx.login({
            success(res) {
              if (res.code) {
                var code = res.code;
                that.setData({jscode:code})
              }else{
                setTimeout(() => {
                  wx.login({
                    success(res) {
                      if (res.code) {
                        var code = res.code;
                        that.setData({jscode:code})
                      }
                    }
                  })
                }, 400)
              }
            }
          })
          
          that.setData({
            isLogin : false
          })
        }
      })
    } else {
      setTimeout(() => {
        that.isCodeHasUser()
      }, 400)
    }
  },
    //第一次授权
  getPhoneNumber:async function(res) {
      var that = this;
      
      if (res.detail.errMsg == 'getPhoneNumber:ok') {
        //用户按了允许授权按钮
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的手机号如下：");
        console.log(res);
        var data = res.detail;
        var encryptedData = data.encryptedData;
        var iv = data.iv;
        
        wx.checkSession({success:res=>{
          console.log('有效期内')
          // debugger
        },fail:erro=>{
          console.log('已经过期')
          
          wx.login({
            success(res) {
              if (res.code) {
                var code = res.code;
                that.setData({jscode:code})
              }
            }
          })
          
          wx.showToast({
            title: '登录状态过期，请重新登录',
          })
          return
        }})

        //检查一下jscode是否过期 过期了重新刷新页面获取新的jscode


        var code = that.data.jscode;
        //授权成功后,通过改变 isLogin 的值，让实现页面显示出来，把授权页面隐藏起来
        //授权成功后加加密信息和jscode传给后台，后台换回手机号 并且可以注册用户信息（存手机号，用户openid），调用成功后返回用户手机号、userId，userName
        //进入tab页面 
        // var name = base64.base64Encode("腻腻")
        console.log('名称')
          console.log(that.data.userInfo.name)
          var p = {
            "jsCode": code,
            "encryptedData": encryptedData,
            "iv": iv,
            "name": base64.encode(that.data.userInfo.name),
            "url": that.data.userInfo.url
          }
          console.log('baser')
          console.log(p)
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
              };
              app.setUser(info)
              wx.switchTab({
                url: '../publish/publish',
              })
              that.setData({
                isLogin : true,
                hasPhoneNumber:true
              })
            }else{
              //重新授权登录
              that.isCodeHasUser()
              that.setData({
                isLogin : false,
                hasPhoneNumber:false
              })
            }
          })
      } else {
  
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function(res) {
            // 用户没有授权成功，不需要改变 isLogin 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
   },
  //授权同意之后 弹出确认弹框 提示用手机来注册或者登录小程序
  getUserInfo:function(res){
    
    if (res.detail.errMsg == 'getUserInfo:ok') {
        //用户按了允许授权按钮
        var that = this;
        var data = JSON.parse(res.detail.rawData);
        var nickName = data.nickName;
        var userInfo = {
            name: nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "") ,
            url: data.avatarUrl
        }
        // debugger
        that.setData({
          userInfo:userInfo,
          hasUserInfo: true,
          showConfirmAuthorization:true
        })
      } else {
  
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function(res) {
            // 用户没有授权成功，不需要改变 isLogin 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
  },
  cancel:function(){
    var that  = this;
    that.setData({showConfirmAuthorization:false})
  },
  closeMask:function(){
    var that  = this;
    that.setData({showConfirmAuthorization:false})
  },

  goTermsServicePage:function(){
    wx.navigateTo({
      url: 'terms-of-service',
    })
  }
    
})