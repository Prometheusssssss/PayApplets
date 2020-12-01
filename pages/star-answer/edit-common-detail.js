// pages/adventure/edit-common-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerInfo: {},
    clueValue:'',
    openContionsValue:'',
    coordinateValue:'',
    endingValue:'',

    parameter:{},
    showSaveConfirm:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  saveGuestValue: async function(e){
    var that = this;
    
    var form = e.detail.value;
    var p = {
      KID:-1,
      STATUS: '待审核',
      SUBJECT: form.SUBJECT,
      TRUE_ANSWER: form.TRUE_ANSWER,
      FALSE_ANSWER: form.FALSE_ANSWER,
      FILLER_ID: app.getUser().id,
      FILLER: app.getUser().name,
    }
    that.setData({
      parameter:p,
      showSaveConfirm:true
    })
  },
  confirmSave:function(){
    var that = this;
    var p = that.data.parameter;
    wx.showLoading({
      title: '保存中...'
    })
    that.createAdventure(p)
  },
  createAdventure: function (p) {
    var that = this;
    app.ManageExecuteApi('/api/_cud/createAndUpdate/B_STAR_ANSWER', '', p, 'POST').then((result) => {
      wx.hideLoading()
      if (result != 'error') {
        that.setData({
          showSaveConfirm: false
        })
        wx.showToast({
          title: '保存成功，感谢您的投稿，请等待管理员审核~',
          icon:'none',
          duration: 3000
        })
        setTimeout(()=>{
         wx.navigateBack({
           delta:1
         })
        },3000)
      
      }
    })
    
  },

})