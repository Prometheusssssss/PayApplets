// pages/adventure/edit-common-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adventureInfo: {},
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
      var adventureInfo = JSON.parse(options.adventureInfo)
      that.setData({
        adventureInfo : adventureInfo
      })
    }
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  saveGuestValue: async function(e){
    var that = this;
    var adventureInfo = that.data.adventureInfo;
    var form = e.detail.value;
    var p = {
      KID:-1,
      GROUPS: adventureInfo.GROUPS,
      NAME: adventureInfo.NAME,
      IS_ENABLE: 0,
      CLUE: form.CLUE,//线索
      OPENING_CONDITIONS: form.OPENING_CONDITIONS,//开启条件
      COORDINATE: form.COORDINATE,//坐标
      ENDING: form.ENDING,//结局,
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
    // wx.showLoading({
    //   title: '保存中...'
    // })
    that.createAdventure(p)
  },
  createAdventure: function (p) {
    var that = this;
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_adventure_strategy', '', p, 'POST').then((result) => {
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