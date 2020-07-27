// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  onShow: function(){
    var that = this;
    that.loadUserInfo()
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
            tel: dataList[0].PHONE
          };
        app.setUser(info)
        that.setData({userInfo: dataList[0]})
      }
    })
  },
  //“我发布的”页面
  goMyPublishPage: function(){
    wx.navigateTo({
      url: '../myPublish/myPublish',
    })
  },
  goMySoldPage: function(){
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
    wx.navigateTo({
      url: '../extractCach/extractCach-record',
    })
  },
  extractCachCheck:function(){
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