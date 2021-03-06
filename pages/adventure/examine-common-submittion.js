// pages/adventure/examine-common-submittion.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cookInfo:{},
    cookList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options){
      var adventure = JSON.parse(options.cookInfo);
      that.setData({cookInfo:adventure})
    }
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.loadcookList()
  },
  // 2、贡献人，投稿页面启用的时候不直接写入了，开放一个贡献人字段，文本填写写入
  // 3、管理员编辑上传位置图片 ，没有图片则首页不展示具体位置，具体参考UI原型
  loadcookList:function(){
    var that = this;
    var cookInfo = that.data.cookInfo;
    var  filter = [
      {
        "fieldName": "GROUPS",
        "type": "date",
        "compared": "=",
        "filterValue": cookInfo.GROUPS
      },{
        "fieldName": "CATEGORY_NAME",
        "type": "date",
        "compared": "=",
      "filterValue": cookInfo.CATEGORY_NAME
    },
    {
      "fieldName": "IS_ENABLE",
      "type": "date",
      "compared": "=",
      "filterValue": 0
    },
  ]
    var p = {
      "tableName": "b_adventure_strategy",
      "page": 1,
      "limit": 10000,
      "filters": filter,
      "orderByField": "CRT_TIME",
      "isDesc":1
    }
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        if(dataList.length>0){
          that.setData({cookList : dataList})
        }else{
          wx.showToast({
            title: '暂无投稿，请返回上级页面',
            icon:'none',
            duration:1000
          })
        }
        
      }
    })
  },
  saveGuestValue: async function(e){
    var that = this;
    var cookInfo = that.data.cookInfo;
    var form = e.detail.value;
    var currentItem = e.currentTarget.dataset.item;
    wx.showLoading({
      title: '保存中...'
    })
    //贡献人id先不管了 有可能贡献人的id现在存的是不对的
    var p = {
      KID: currentItem.KID,
      GROUPS: cookInfo.GROUPS,
      CATEGORY_NAME: cookInfo.CATEGORY_NAME,
      IS_ENABLE: 1,
      NAME: form.NAME,//线索
      CONTRIBUTOR: form.CONTRIBUTOR,
    }
    that.createAdventure(p)
  },
  //把这个GRUOPS下name是天命风流的启用的禁用掉，把当前传给你的值启用，
  createAdventure: function (p) {
    app.ManageExecuteApi('/api/_cud/enableTable/b_adventure_strategy', '', p, 'POST').then((result) => {
      wx.hideLoading()
      if (result != 'error') {
        setTimeout(()=>{
         wx.navigateBack({
           delta:1
         })
        },200)
      
      }
    })
    
  },
})