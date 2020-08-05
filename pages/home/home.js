// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[{
      PICTURE_URL:'../../assets/img/banner/banner.png'
    }],
    areaList:[{
      URL:'../../assets/img/area/xiaoaojianghu.png',
      NAME:'新笑傲江湖'
    },{
      URL:'../../assets/img/area/tiandao.png',
      NAME:'天涯明月刀'
    },{
      URL:'../../assets/img/area/tianyu.png',
      NAME:'天谕'
    },{
      URL:'../../assets/img/area/more.png',
      NAME:'更多游戏'
    }]
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
  goPublishPage:function(){
      wx.switchTab({
        url: '../order/order',
      })
  }
  
})