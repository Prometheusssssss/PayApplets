// pages/guest-information/guest-information-add.js
const app = getApp()
const {
  common
} = global;
var compressor = require("../../assets/js/compressor-image.js");
const { base64 } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    id:'',                        //上传时后端返回的图片ID,拼接后存入
    joinString:'',                 
    uploaderList: [],              //保存上传图片url的数组
    uploaderNum: 0,             //已经上传的图片数目
    showUpload: true,           //控制上传框的显隐

    // showConfirmAuthorization:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
        //获取对应的index
    // if(options){
      var userInfo = app.getUser()
      that.setData({
        userInfo: userInfo
      })
      var uploaderList = userInfo.url.split(',');
      if(uploaderList.length>=1){
        that.setData({
          showUpload:false,
          uploaderList:uploaderList,
          userName : userInfo.name
        })
      }
     
    // }
      
  },

  onShow: function(){
    var that = this;
    
  },
 
 
  
  upload: function(){
    var that = this;
    //选择图片
    wx.chooseImage({//调起选择图片
      count: 1 - that.data.uploaderNum, // 默认6
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
        if (that.data.uploaderList.length == 1) {
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

  handleInputChange:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({userName:value})
  },
  getImgUrl:async function(imgList){
    var that = this;
    var url = '';
    var UploadImageP = []
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
      return url

    }
  },
  //第一次授权
  getPhoneNumber:async function(res) {
    var that = this;
    if (res.detail.errMsg == 'getPhoneNumber:ok') {
      var data = res.detail;
      var encryptedData = data.encryptedData;
      var iv = data.iv;
      var code = await app.getJsCode();
      var p = {
        'kid':that.data.userInfo.id,
        "jsCode": code,
        // "name": base64.encode(that.data.userInfo.name),
        // "url": that.data.userInfo.url,
        "encryptedData": encryptedData,
        "iv": iv,
      }
      await app.ManageExecuteApi(`/api/_login/doUpdate`, '', p, "POST").then((userInfo) => {
        if(userInfo != 'error'){
          var data = userInfo[0];
          var info = {
            id: data.KID,
            code: data.CODE,
            name: data.NAME,
            url: data.IMG_URL,
            isManager: data.IS_SA,
            tel: data.PHONE,
            isPermanent: data.IS_PERMANENT,
            countNumber: data.COUNT_NUMBER,
          };
          app.setUser(info)
          that.setData({
            userInfo: info
          })
          wx.showToast({
            title: '补充手机号成功',
            icon:'none',
            duration:1500
          })
        }else{
          //重新授权登录
          wx.showToast({
            title: '补充手机号失败',
            icon:'none',
            duration:1500
          })
        }
      })
    } else {
      wx.showToast({
        title: '注册解锁更多功能哦~',
        icon:'none',
        duration:1500
      })
    }
  },


  saveUserInfo: async function (e) {
    var that = this;
    var data = that.data;
    var form = e.detail.value;
    var uploaderImgList = data.uploaderList;
    // 校验必填项，专区，大区，价格（非空数字），商品名称，
    if(uploaderImgList.length==0){
      wx.showToast({
        title: '请先上传头像',
        icon:'none',
        duration:1000
      })
      return
    }
    wx.showLoading({
      title: '保存中...',
    })
    
    //获取可以压缩的图片
   
    var mainImgUrl = uploaderImgList[0];
    var imgUrls = '';
    if(data.uploaderNum == 1){
      imgUrls =  await that.getImgUrl(uploaderImgList);
      if(imgUrls != ''){
        var imgList = imgUrls.split(',');
        mainImgUrl = imgList[0];
      }
      var p = {
        KID:  app.getUser().id,
        NAME: data.userName,
        IMG_URL: mainImgUrl
      }
    }else{
      var p = {
        KID:  app.getUser().id,
        NAME: data.userName,
      }
    }
    that.updateUserInfo(p)
  },
  //更新用户信息  没有手机号的更新 授权之后就去update接口，返回手机号后直接显示手机号；；保存的直接调用表存
  updateUserInfo: async function (p) {
    // _login/doUpdate  /api/_login/doUpdate
    // jsCode kid name url encryptedData  iv  
    await app.ManageExecuteApi('/api/_cud/createAndUpdate/a_user', '', p, "POST").then((userInfo) => {
      if(userInfo != 'error'){//存入user  跳转页面
        
        wx.showToast({
          title: '保存成功',
          icon:'none',
          duration:1500
        })
        setTimeout(()=>{
          var pages=getCurrentPages();//页面指针数组
          var prepage=pages[pages.length-2];//上一页面指针
          prepage.loadUserInfo()
          wx.navigateBack({
            delta: 1,
          })
        },400)
        
       
      }else{
        wx.showToast({
          title: '保存失败',
          icon:'none',
          duration:1500
        })
        
      }
    })
    
  },
})