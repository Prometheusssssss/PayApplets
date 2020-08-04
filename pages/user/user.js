// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    imageUrl:'',
    tmpPath:'',
    // isPic : false,
    isManager:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  onShow: function(){
    var that = this;
    that.loadUserInfo();
   
    // await that.getImageUrl()
    // that.createCanvas()
  },
  
  //画完图片调起保存图片功能
  createCanvas : async function(){
    var that = this;
    var imageUrl = await new Promise(r => {
      wx.getImageInfo({
          src: 'https://oss.dazuiba.cloud:8003//api/oss/20200804-0deffc20-1562-4720-97b0-33aa768142ba/image',
          success(gInfo) {
               // 下载成功 即可获取到本地路径
              r(gInfo.path)
          }
      })
  })
    let ctx = wx.createCanvasContext('share_canvas', this);
    // debugger
    //画图片
    ctx.drawImage(imageUrl, 0, 0, 300, 400);
    ctx.draw(true,setTimeout(function(){
       //画完了转成图片链接
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 500,
            height: 400,
            canvasId: 'share_canvas',
            success: function(res){
                console.log('res.tempFilePath')
                console.log(res.tempFilePath)
                that.setData({tmpPath : res.tempFilePath})
            },
        })
    },1000));
  },
  saveImg(){
    let that = this;
    console.log(1)
    wx.getSetting({
        success: function(res){
            //不存在相册授权
            if (!res.authSetting['scope.writePhotosAlbum']){
                wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success: function(){
                        that.savePhoto();
                        that.setData({
                            isPic: false
                        })
                    },
                    fail: function(err){
                        that.setData({
                            isPic: true
                        })
                    }
                })
            }else{
                that.savePhoto(); 
            }
        }
    })
    

 },
 handleSetting(e){
     var that = this;
     if (!e.detail.authSetting['scope.writePhotosAlbum']){
         wx.showModal({
             title: '警告',
             content: '不授权无法保存',
             showCancel: false
         })
         that.setData({
             isPic: true
         })
     }else{
         wx.showToast({
             title: '保存成功'
         })
         that.setData({
             isPic: false
         })
     }
 },
 savePhoto(){
   var that = this;
     let urlStr = that.data.tmpPath;
     var that = this;
     //downloadFile 调起保存
     wx.downloadFile({
         url: urlStr,
         success: function (res) {
             wx.saveImageToPhotosAlbum({
                 filePath: res.tempFilePath,
                 success: function (data) {
                     wx.showToast({
                         title: '保存成功',
                         icon: 'success',
                         duration: 1500
                     })

                 }
             })
         }
     })
 },
 bindGetUserInfo(e){
     if(!e.detail.userInfo){
        console.log('用户点击了取消')
     }else{
         console.log(e.detail.userInfo)
     } 
},
//生成海报end
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
            authorizeSeller: dataList[0].AUTHORIZED_SELLER
          };
        var isManager = dataList[0].IS_SA;
        that.setData({isManager:isManager})
        app.setUser(info)
        that.setData({userInfo: dataList[0]})
      }
    })
  },
  //“我发布的”页面
  goMyPublishPage: function(){
    var authorizeSeller = app.getUser().authorizeSeller;
    //没有卖家授权
    if(!authorizeSeller){
      wx.showToast({
        title:'当前仅限授权卖家查看，如需开通卖家功能请联系客服',
        icon:'none',
        duration:2000
      })
      return
    }
    wx.navigateTo({
      url: '../myPublish/myPublish',
    })
  },
  goMySoldPage: function(){
    var authorizeSeller = app.getUser().authorizeSeller;
    //没有卖家授权
    if(!authorizeSeller){
      wx.showToast({
        title:'当前仅限授权卖家查看，如需开通卖家功能请联系客服',
        icon:'none',
        duration:2000
      })
      return
    }
    wx.navigateTo({
      url: '../mySold/mySold',
    })
  },
  goMyBoughtPage: function(){
    wx.navigateTo({
      url: '../myBought/myBought',
    })
  },
  goCustomerPage: function(){
    var isManager = app.getUser().isManager;
    //没有卖家授权
    if(!isManager){
      wx.showToast({
        title:'当前仅限授权客服查看',
        icon:'none',
        duration:2000
      })
      return
    }
    wx.navigateTo({
      url: '../customerOrder/customerOrder',
    })
  },
  //查询用户当前有没有待审核状态的提现记录
  goImmediateWithdrawalPage:function(){
    var filter = [
      { //卖家id
        "fieldName": "STATUS",
        "type": "date",
        "compared": "=",
        "filterValue": '待审核'
      },
      { //卖家id
        "fieldName": "USER_ID",
        "type": "date",
        "compared": "=",
        "filterValue": app.getUser().id
      },
    ]
    var p = {
      "tableName": "b_withdrawal",
      "page": 1,
      "limit": 1000000,
      "filters": filter
    }
    console.log('查询数据')
    console.log(JSON.stringify(p))
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        if(dataList.length>0){
          wx.showToast({
            title: '当前已存在待审核的提现申请，请等待审核。',
            icon:'none',
            duration:1000
          })
        }else{
          wx.navigateTo({
            url: '../extractCach/extractCach-apply',
          })
        }
      }
    })
   
  },
  extractCashRecord:function(){
    var authorizeSeller = app.getUser().authorizeSeller;
    //没有卖家授权
    if(!authorizeSeller){
      return
    }
    wx.navigateTo({
      url: '../extractCach/extractCach-record',
    })
  },
  extractCachCheck:function(){
    var isManager = app.getUser().isManager;
    //没有卖家授权
    if(!isManager){
      wx.showToast({
        title:'当前仅限授权客服查看',
        icon:'none',
        duration:2000
      })
      return
    }
    wx.navigateTo({
      url: '../extractCach/extractCach-check',
    })
  },
  //联系客服
  handleContact :function(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  editRemark:function() {
    //意见反馈页面
    wx.navigateTo({
      url: '../remark/remark',
    })
  },
  changeUser:function(){
    var that = this;
    var userInfo = {
      IMG_URL: that.data.userInfo.IMG_URL,
      NAME: that.data.userInfo.NAME,
      PHONE: that.data.userInfo.PHONE
    };
    wx.navigateTo({
      url: `change-info?userInfo=${JSON.stringify(userInfo)}`,
    })
  },
  //注销
  loginOut:function(){
    var that = this;
    var kid = app.getUser().id;
    var p = {
      KID: kid,
      OPEN_ID: '',
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/a_user', '', p, 'POST').then((result) => {
      if (result != 'error') {
        //更新订单
        wx.reLaunch({
          url: '../login/login?hasUserInfo=1'
        })
      }
    })
  }
})