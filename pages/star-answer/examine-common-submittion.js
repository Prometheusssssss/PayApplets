// pages/answer/examine-common-submittion.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerInfo:{},
    answerList:[],
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
    var that = this;
    that.loadAnswer()
  },
  
  loadAnswer:function(){
    var that = this;
    var  filter = [
     {
        "fieldName": "STATUS",
        "type": "date",
        "compared": "=",
        "filterValue": '待审核'
      }]
    var p = {
      "tableName": "B_STAR_ANSWER",
      "page": 1,
      "limit": 10000,
      "filters": filter
    }
    if(that.data.searchText != ''){
      app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
        if (dataList != 'error') {
          that.setData({
            answerList: dataList
          })
        }
      })
    }
    
  },
  saveGuestValue: async function(e){
    var that = this;
    var answerInfo = that.data.answerInfo;
    var form = e.detail.value;
    var currentItem = e.currentTarget.dataset.item;
    wx.showLoading({
      title: '保存中...'
    })
    //贡献人id先不管了 有可能贡献人的id现在存的是不对的
    var p = {
      KID: currentItem.KID,
      STATUS: '已启用',
      SUBJECT: form.SUBJECT,
      TRUE_ANSWER: form.TRUE_ANSWER,
      FALSE_ANSWER: form.FALSE_ANSWER,
      // FILLER_ID: app.getUser().id,
      // FILLER: app.getUser().name,
    }
    that.createanswer(p,'保存成功')
  },
  //把这个GRUOPS下name是天命风流的启用的禁用掉，把当前传给你的值启用，
  createanswer: function (p,msg) {
    var that = this;
    app.ManageExecuteApi('/api/_cud/createAndUpdate/B_STAR_ANSWER', '', p, 'POST').then((result) => {
      wx.hideLoading()
      if (result != 'error') {
        that.setData({
          showSaveConfirm: false
        })
        wx.showToast({
          title: msg,
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
  bindSubjectInput: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    that.setData({
      ["answerList["+index+"].SUBJECT"]: value
    })
  },
  bindtrueInput: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    that.setData({
      ["answerList["+index+"].TRUE_ANSWER"]: value
    })
  },
  bindfalseInput: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    that.setData({
      ["answerList["+index+"].FALSE_ANSWER"]: value
    })
  },
  refuse: function(e){
    var that = this;
    var answerInfo = that.data.answerInfo;
    var currentItem = e.currentTarget.dataset.item;
    wx.showLoading({
      title: '保存中...'
    })
    //贡献人id先不管了 有可能贡献人的id现在存的是不对的
    var p = {
      KID: currentItem.KID,
      STATUS: '已拒绝',
      SUBJECT: currentItem.SUBJECT,
      TRUE_ANSWER: currentItem.TRUE_ANSWER,
      FALSE_ANSWER: currentItem.FALSE_ANSWER,
      // FILLER_ID: app.getUser().id,
      // FILLER: app.getUser().name,
    }
    that.createanswer(p,'拒绝成功')
  },
})