// pages/user/user.js
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
  }
})