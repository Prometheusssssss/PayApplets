// pages/adventure/edit-common-detail.js
const app = getApp()
var compressor = require("../../assets/js/compressor-image.js");
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
    pageType:'add',

    showClearConfirm:false,

    id:'',                        //上传时后端返回的图片ID,拼接后存入
    joinString:'',                 
    uploaderList: [],              //保存上传图片url的数组
    uploaderNum: 0,             //已经上传的图片数目
    showUpload: true,           //控制上传框的显隐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options){
      var fishInfo = JSON.parse(options.fishInfo);
      var uploaderList = [];
      if(fishInfo.CONTENT != ''){
        if(fishInfo.CONTENT!= undefined && fishInfo.CONTENT!= null&& fishInfo.CONTENT!= ''){
          uploaderList = fishInfo.CONTENT.split(',');
          if(uploaderList.length>=5){
            that.setData({showUpload:false})
          }
          that.setData({
            uploaderList:uploaderList,
          })
        }
      }
      that.setData({
        pageType:'edit'
      })
      that.setData({
        fishInfo : fishInfo,
      })
    }
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  clearContributor:function(){
    var that = this;
    that.setData({
      showClearConfirm:true
    })
  },
  upload: function(){
    var that = this;
    //选择图片
    wx.chooseImage({//调起选择图片
      count: 5 - that.data.uploaderNum, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.data.uploaderList.concat(res.tempFilePaths);
        var uploaderList = res.tempFilePaths;
        that.setData({
          uploaderList: that.data.uploaderList.concat(res.tempFilePaths),
        })
        that.setData({
          uploaderNum: that.data.uploaderList.length
        })
        if (that.data.uploaderList.length == 5) {
          that.setData({
            showUpload:false
          })
        }
      }
    })
  },
  //展示图片
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
 // 删除图片
  clearImg: function (e) {
    var that = this
    var nowList = [];//新数据
    var uploaderList = that.data.uploaderList;//原数据
    
    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        var arr = that.data.joinString.split(',')
            arr.splice(i, 1);                              //删除图片的同时删除掉其对应的ID
            var newArr = arr.join(',')
      } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true,
    })
   },
   getImgUrl:async function(imgList){
    var that = this;
    var url = '';
    var UploadImageP = []
    wx.showLoading({
      title: '图片上传中...',
    })
    if(imgList.length == 0){
      return url
    }else{
      
      for (var i = 0; i < imgList.length; i++) {
        var minFile = await compressor.Main(imgList[i], that)
        var base64 = wx.getFileSystemManager().readFileSync(minFile, "base64");
        UploadImageP.push({
          name: 'productPicture',
          content: base64
        })
      }
      await app.UploadImage(UploadImageP).then((uploadImageResult) => {
        if(uploadImageResult.length>0){
          uploadImageResult.forEach(result=>{
             url += result.url +',';
          })
          url = url.substring(url.length-1,0);
        }
      })
      wx.hideLoading()
      return url

    }
  },
  saveGuestValue: async function(e){
    var that = this;
    var data = that.data;
    var fishInfo = that.data.fishInfo;
    var form = e.detail.value;
    var uploaderImgList = data.uploaderList;
    var mainImgUrl = '';
    var imgUrls = '';
    imgUrls =  await that.getImgUrl(uploaderImgList);
    if(imgUrls != ''){
      // var imgList = imgUrls.split(',');
      mainImgUrl = imgUrls;
    }
    wx.showLoading({
      title: '保存中...',
      icon:'none',
      duration:2000
    })
    var p = {
      PID: fishInfo.KID,
      DETAIL_NAME: form.DETAIL_NAME,
      IS_ENABLE: 1,
      CONTENT: mainImgUrl,
      FILLER_ID: app.getUser().id,
      FILLER: app.getUser().name,
      CONTRIBUTOR: fishInfo.CONTRIBUTOR == null?'': fishInfo.CONTRIBUTOR,
      CONTRIBUTOR_ID: fishInfo.CONTRIBUTOR_ID == null? '': fishInfo.CONTRIBUTOR_ID,
    }
    if(that.data.pageType == 'add'){
      p.KID = -1;
    }else  if(that.data.pageType == 'edit'){
      p.KID = fishInfo.DETAIL_ID
    }
    that.createAdventure(p)
  },
  createAdventure: function (p) {
    app.ManageExecuteApi('/api/_cud/createAndUpdate/B_FOOD_FISH', '', p, 'POST').then((result) => {
      wx.hideLoading()
      if (result != 'error') {
        wx.showToast({
          title: '保存成功',
          icon:'none',
          duration: 1000
        })
        setTimeout(()=>{
         wx.navigateBack({
           delta:1
         })
        },1000)
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
  confirmClear:function(){
    var that = this;
    var p = {
      KID: that.data.fishInfo.DETAIL_ID,
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
            ["fishInfo.CONTRIBUTOR"] : '',
            ["fishInfo.CONTRIBUTOR_ID"] : '',
          })
      }
    })
  }
})