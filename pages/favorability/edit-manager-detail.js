// pages/adventure/edit-common-detail.js
const app = getApp()
var compressor = require("../../assets/js/compressor-image.js");
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
    pageType:'add',

    showClearConfirm:false,

    id:'',                        //上传时后端返回的图片ID,拼接后存入
    joinString:'',                 
    uploaderList: [],              //保存上传图片url的数组
    uploaderNum: 0,             //已经上传的图片数目
    showUpload: true,           //控制上传框的显隐

    favorabilityList:[{
      KID:-1,
      PROPS_NAME:'',
      INTIMACY: ''
    }],

    inimacyMax:null,
    deleteIds:[],
    // RECOMMEND 推荐使用
  },
  // {
  //   "recommand":"123123",
  //   "details":[
  //     {
  //       "PID":"1",
  //       "KID":"30",
  //       "PROPS_NAME":"30",
  //       "INTIMACY":"30",
  //     },
  //     {
  //       "PID":"1",
  //       "KID":"30",
  //       "PROPS_NAME":"30",
  //       "INTIMACY":"30",
  //     },
  //     {
  //       "PID":"1",
  //       "KID":"30",
  //       "PROPS_NAME":"30",
  //       "INTIMACY":"30",
  //     }
  //   ]
  // }
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options){
      var favorabilityInfo = JSON.parse(options.favorabilityInfo);
      var type = options.type;
      that.setData({
        favorabilityInfo : favorabilityInfo,
        pageType:type
      })
      
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.loadfavorabilityList()
  },
  loadfavorabilityList:function(){
    var that = this;
    var favorabilityInfo = that.data.favorabilityInfo
    var  filter = [
      {
        "fieldName": "PID",
        "type": "date",
        "compared": "=",
        "filterValue": favorabilityInfo.PID
      }, {
        "fieldName": "NAME",
        "type": "string",
        "compared": "like",
        "filterValue": favorabilityInfo.NAME
      }]
      var p = {
        "tableName": "v_partner_detail",
        "page": 1,
        "limit": 10000,
        "filters": filter,
        "orderByField": "INTIMACY",
        "isDesc":1
      }
   
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        if(dataList.length>0){
          var list = [];
          dataList.forEach(data=>{
            list.push({
              KID: data.KID,
              PID: data.PID,
              PROPS_NAME: data.PROPS_NAME,
              INTIMACY: data.INTIMACY
            })
          })
          that.setData({
            favorabilityList :list,
            inimacyMax: dataList[0].INTIMACY
          })
        }
     
      }
    })
  },

  copyManagerFavorabilty: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var favorabilityList = that.data.favorabilityList;

    var favorab = JSON.parse(JSON.stringify(favorabilityList[index]));
    favorab.PID = that.data.favorabilityInfo.PID;
    favorab.KID = -1;
    favorab.PROPS_NAME = '';
    favorab.INTIMACY = '';

    favorabilityList.splice(index + 1, 0, favorab)
    that.setData({ favorabilityList: favorabilityList })
  },
  removeManagerFavorabilty: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var deleteItem = e.currentTarget.dataset.item;
    
    var deleId = deleteItem.KID;
    var deleteIds = [];
    deleteIds.push(deleId);
    deleteIds = deleteIds.concat(that.data.deleteIds)
    var favorabilityList = that.data.favorabilityList;
    favorabilityList.splice(index, 1);
    that.setData({
      favorabilityList: favorabilityList ,
      deleteIds:deleteIds
    })
  },
  bindNameChangeTextArea: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    that.setData({
      ["favorabilityList["+index+"].PROPS_NAME"]: value
    })
  },
  handleRecommdInput: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    that.setData({
      ["favorabilityInfo.RECOMMEND"]: value
    })
  },
  handleInput: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    that.setData({
      ["favorabilityList["+index+"].INTIMACY"]: value
    })
  },
  clearContributor:function(){
    var that = this;
    that.setData({
      showClearConfirm:true
    })
  },
  
  saveGuestValue: async function(e){
    var that = this;
    var data = that.data;
    var favorabilityList = data.favorabilityList;
    //俩不为空 
    var newFavorList = [];
    var newDeleteIds = []
    favorabilityList.forEach(favor=>{
      favor.PID = that.data.favorabilityInfo.PID;
      if(favor.INTIMACY!= 0 && favor.NAME!= ''){
        newFavorList.push(favor)
      }else{
        newDeleteIds.push(favor.KID)
      }
    })
    var deleteIds = that.data.deleteIds.concat(newDeleteIds);
    // 推荐使用要是换行的很长的咋办,输入推荐是多行输入吗
    var p = {
      "delkids": deleteIds.toString(),
      "recommand": that.data.favorabilityInfo.RECOMMEND == null ? '' : that.data.favorabilityInfo.RECOMMEND ,
	    "details": newFavorList
    }
    that.createAdventure(JSON.stringify(p))
  },
  createAdventure: function (p) {
    var that = this;
    app.ManageExecuteApi('/api/_cud/createPartner', '', p, 'POST').then((result) => {
      wx.hideLoading()
      if (result != 'error') {
        wx.showToast({
          title: '保存成功',
          icon:'none',
          duration: 1000
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
          currentSliderbar: that.data.favorabilityInfo.PID
        })
        setTimeout(()=>{
         wx.navigateBack({
           delta:1
         })
        },1000)
      }
    })
  },

  confirmClear:function(){
    var that = this;
    var p = {
      KID: that.data.adventureInfo.DETAIL_ID,
      CONTRIBUTOR: '',
      CONTRIBUTOR_ID: '',
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_adventure_strategy', '', p, 'POST').then((result) => {
      if (result != 'error') {
          wx.showToast({
            title: '清空成功',
            icon:'none',
            duration:1500
          })
          that.setData({
            showClearConfirm:false,
            ["adventureInfo.CONTRIBUTOR"] : '',
            ["adventureInfo.CONTRIBUTOR_ID"] : '',
          })
      }
    })
  }
})