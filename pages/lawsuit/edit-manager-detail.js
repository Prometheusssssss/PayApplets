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

    lawsuitList:[{
      KID:-1,
      NAME:'',
      CONTENT: ''
    }],

    deleteIds:[],
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options){
      var lawsuitInfo = JSON.parse(options.lawsuitInfo);
      var type = options.type;
      that.setData({
        lawsuitInfo : lawsuitInfo,
        pageType:type
      })
      
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.loadlawsuitList()
  },
  loadlawsuitList:function(){
    var that = this;
    var lawsuitInfo = that.data.lawsuitInfo
    var  filter = [
      {
        "fieldName": "CATEGORY_ID",
        "type": "date",
        "compared": "=",
        "filterValue":lawsuitInfo.PID
      }]
    var p = {
      "tableName": "v_duanan_detail",
      "page": 1,
      "limit": 10000,
      "filters": filter
    }
   
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        if(dataList.length>0){
          var list = [];
          dataList.forEach(data=>{
            list.push({
              KID: data.KID,
              PID: data.PID,
              NAME: data.NAME,
              CONTENT: data.CONTENT
            })
          })
          that.setData({
            lawsuitList :list
          })
        }
     
      }
    })
  },

  copyManagerFavorabilty: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var lawsuitList = that.data.lawsuitList;

    var favorab = JSON.parse(JSON.stringify(lawsuitList[index]));
    favorab.PID = that.data.lawsuitInfo.PID;
    favorab.KID = -1;
    favorab.NAME = '';
    favorab.CONTENT = '';

    lawsuitList.splice(index + 1, 0, favorab)
    that.setData({ lawsuitList: lawsuitList })
  },
  removeManagerFavorabilty: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var deleteItem = e.currentTarget.dataset.item;
    
    var deleId = deleteItem.KID;
    var deleteIds = [];
    deleteIds.push(deleId);
    deleteIds = deleteIds.concat(that.data.deleteIds)
    var lawsuitList = that.data.lawsuitList;
    lawsuitList.splice(index, 1);
    that.setData({
      lawsuitList: lawsuitList ,
      deleteIds:deleteIds
    })
  },
  bindNameChangeTextArea: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    that.setData({
      ["lawsuitList["+index+"].CONTENT"]: value
    })
  },
  handleInput: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    that.setData({
      ["lawsuitList["+index+"].NAME"]: value
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
    var lawsuitList = data.lawsuitList;
    //俩不为空 
    var newFavorList = [];
    var newDeleteIds = []
    lawsuitList.forEach(favor=>{
      favor.PID = that.data.lawsuitInfo.PID;
      if(favor.CONTENT!= '' && favor.NAME!= ''){
        newFavorList.push(favor)
      }else{
        newDeleteIds.push(favor.KID)
      }
    })
    var deleteIds = that.data.deleteIds.concat(newDeleteIds);
    // 推荐使用要是换行的很长的咋办,输入推荐是多行输入吗
    var p = {
      "delkids": deleteIds.toString(),
	    "details": newFavorList
    }
    that.createAdventure(JSON.stringify(p))
  },
  createAdventure: function (p) {
    var that = this;
    app.ManageExecuteApi('/api/_cud/createDuanan', '', p, 'POST').then((result) => {
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
          currentSliderbar: that.data.lawsuitInfo.PID
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