// pages/adventure/edit-common-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fishInfo: {},
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
    if(options){
      var fishInfo = JSON.parse(options.fishInfo)
      that.setData({
        fishInfo : fishInfo
      })
    }
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
//   GROUPS=秦川
// CATEGORY_NAME=葫芦鸡
// NAME=鸡肉调料
// CONTENT=图片
  saveGuestValue: async function(e){
    var that = this;
    var fishInfo = that.data.fishInfo;
    var form = e.detail.value;
    var p = {
      KID:-1,
      PID: fishInfo.KID,
      DETAIL_NAME: form.DETAIL_NAME,
      FILLER_ID: app.getUser().id,
      FILLER: app.getUser().name,
      IS_ENABLE: 0,
      CONTENT:'',
    }
    that.setData({
      parameter:p,
      showSaveConfirm:true
    })
  },
  confirmSave:function(){
    var that = this;
    var p = that.data.parameter;
    that.createAdventure(p)
  },
  createAdventure: function (p) {
    var that = this;
    app.ManageExecuteApi('/api/_cud/createAndUpdate/B_FOOD_FISH', '', p, 'POST').then((result) => {
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
  isEmojiCharacter: async function(substring) {
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2B05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
          hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
          hs == 0x2b50) {
          return true;
        }
      }
    }
  },
})