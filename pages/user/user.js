// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
})