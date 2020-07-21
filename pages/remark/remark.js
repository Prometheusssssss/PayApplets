// pages/remark/remark.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getRemark:function(){
    var that = this;
    // 插入意见表
    var value = that.data.value;
    if(value=='' || value==undefined){
      wx.showToast({
        title: '输入内容不允许为空',
        icon:'none',
        duration: 1500
      })
      return
    }
    var p = {
      KID:-1,
      USER_ID: app.getUser().id,//用户id
      USER_NAME: app.getUser().name,//用户昵称
      USER_PHONE: app.getUser().tel,//用户电话
      CONTENT: value,//状态
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_feedbook', '', p, 'POST').then((result) => {
      if (result != 'error') {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1500
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })

  },
  clearRemark: function () {
    var that = this;
    that.setData({
      value: '',
    })
  },
  bindChangeTextArea: function (e) {
    var that = this;
    that.setData({
      value: e.detail.value,
    })
  }
  
})