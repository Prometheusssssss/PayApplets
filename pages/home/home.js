// pages/home/home.js
const app = getApp()
const { common,base64 } = global;
var isonShow;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    strategyList1:[{
      URL:'../../assets/img/area/zhihe.png',
      IDENTITY:'',
      NAME:'奇遇',
      TYPE:'qiyu'
    },{
        URL:'../../assets/img/area/love.png',
        IDENTITY:'',
        NAME:'伙伴好友度',
        TYPE:'haoyou'
      }],
    strategyList2:[{
      URL:'../../assets/img/area/search.png',
      IDENTITY:'身份:',
      NAME:'捕快断案',
      TYPE:'bukuai'
    },
    {
      URL:'../../assets/img/area/collect.png',
      IDENTITY:'',
      NAME:'星运计算',
      TYPE:'jisuan'
    }],
    strategyList3:[{
      URL:'../../assets/img/area/xingqiu.png',
      IDENTITY:'',
      NAME:'星运答题',
      TYPE:'xingqiu'
    },
    {
      URL:'../../assets/img/area/calculate.png',
      IDENTITY:'',
      NAME:'琅玟计算',
      TYPE:'lwjisuan'
    }
  ],
    strategyList4:[{
      URL:'../../assets/img/area/commond.png',
      IDENTITY:'',
      NAME:'琅玟推荐',
      TYPE:'lwtuijian'
    },
    {
      URL:'../../assets/img/area/simulation.png',
      IDENTITY:'',
      NAME:'琅玟模拟',
      TYPE:'lwmoni'
    }],
    strategyList5:[{
      URL:'../../assets/img/area/cook.png',
      IDENTITY:'',
      NAME:'厨师菜谱',
      TYPE:'cook'
    },
    {
      URL:'../../assets/img/area/fish.png',
      IDENTITY:'',
      NAME:'食材鱼王',
      TYPE:'fish'
    }],
    userInfo:{},
    isManager:false,
    isLoginUser: false,
    // imageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20200830-4d9d4613-fc94-4a8a-9531-3c0f81cdd7db/image',
    imageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20201016-a8035ddb-f0f9-4417-a772-27f7b30559d2/image',
    // zanImageUrl: 'https://oss.dazuiba.cloud:8003//api/oss/20201014-57dd94e0-3c87-4b14-96bd-c6340c4dfe9d/image',
    zanImageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20201016-bc73298c-340c-4dfe-90b1-74f360a63266/image',

    showConfirmAuthorization:false,
    jscode:'',
    
  },
  //星运计算广告上移 ；； 拓扑图右边，点击放大图；；赞赏图；；；点击激励广告；；；
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.isCodeHasUser();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.isCodeHasUser();
  },
  
  isCodeHasUser: async function () {
    var that = this;
    var code = await app.getJsCode();
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
            tel: data.PHONE,
            isManager: data.IS_SA,
            isPermanent: data.IS_PERMANENT,
            countNumber: data.COUNT_NUMBER,
          };
          app.setUser(info)
          that.setData({
            isLoginUser : true,
            userInfo: info,
          })
        }else{
          //重新授权登录
          wx.login({
            success(res) {
              if (res.code) {
                var code = res.code;
                that.setData({jscode:code})
              }
            }
          })
          that.setData({
            isLoginUser : false,
            userInfo:{},
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
      var data = res.detail;
      var encryptedData = data.encryptedData;
      var iv = data.iv;
      
      wx.checkSession({success:res=>{
        // '有效期内'
      },fail:erro=>{
        // '已经过期'
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
          wx.navigateTo({
            url: '../home/home',
          })
          that.setData({
            isLogin : true,
            hasPhoneNumber:true
          })
        }else{
          //重新授权登录
          that.setData({
              isLoginUser : false,
              userInfo:{}
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
        // var userInfo = {
        //   name: nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "") ,
        //   url: data.avatarUrl
        // }
        // that.setData({
        //   userInfo:userInfo,
        //   showConfirmAuthorization:true
        // })
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
              isManager: data.IS_SA,
              isPermanent: data.IS_PERMANENT,
              countNumber: data.COUNT_NUMBER,
            };
            app.setUser(info)
            that.setData({
              isLoginUser : true,
              userInfo: info,
            })
          }else{
            //重新授权登录
            that.setData({
              isLoginUser : false,
              userInfo:{}
            })
          }
        })
      } else {
        //用户按了拒绝按钮
        that.setData({
          isLoginUser:false
        })
      }
  },
 
  goStrategyPage:function(e){
    var that = this;
    var item = e.currentTarget.dataset.item;
    var type = item.TYPE;
    if(type == 'qiyu'){
      wx.navigateTo({
        url: '../adventure/adventure',
      })
    }
    else if(type == 'haoyou'){
      wx.navigateTo({
        url: '../favorability/favorability',
      })
    }
    else if(type == 'bukuai'){
      wx.navigateTo({
        url: '../lawsuit/lawsuit',
      })
    }else if(type == 'jisuan'){
      wx.navigateTo({
        url: '../star-luck/star-luck',
      })
    }else if(type == 'xingqiu'){
      wx.navigateTo({
        url: '../star-answer/star-answer',
      })
    }else if(type == 'lwjisuan'){
      wx.navigateTo({
        url: '../langwen-calculate/langwen-calculate',
      })
    }
    else if(type == 'lwtuijian'){
      wx.navigateTo({
        url: '../langwen-recommend/langwen-recommend',
      })
    } else if(type == 'cook'){
      wx.navigateTo({
        url: '../cook-book/cook-book',
      })
    } else if(type == 'fish'){
      wx.navigateTo({
        url: '../fish/fish',
      })
    }
    else if(type == 'lwmoni'){
      wx.navigateTo({
        url: '../langwen-simulation/langwen-simulation',
      })
    }
    else{
      wx.showToast({
        title: '开发中敬请期待',
        icon:'none',
        duration: 1000
      })
    }
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "分享攻略", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/home/home`, // 默认是当前页面，必须是以‘/’开头的完整路径
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