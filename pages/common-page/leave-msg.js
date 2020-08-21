// pages/common-page/leave-msg.js
const app = getApp()
const {
  common
} = global;
var compressor = require("../../assets/js/compressor-image.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',                        //上传时后端返回的图片ID,拼接后存入
    joinString:'',                 
    uploaderList: [],              //保存上传图片url的数组
    uploaderNum: 0,             //已经上传的图片数目
    showUpload: true,           //控制上传框的显隐

    receiveInfo:{},
    value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options){
      var receiveInfo = JSON.parse(options.receiveInfo);
      that.setData({
        receiveInfo: receiveInfo
      })
    }
  },
  // onUnload:function(){
  //   var that = this;
  //   var pages = getCurrentPages();
  //   var prevPage = pages[pages.length - 2]; //上一个页面
  //   setTimeout(() => {
  //     prevPage.onLoad()
  //   }, 600);
  // },

  onShow:function(){

  },
  clearRemark: function () {
    var that = this;
    that.setData({
      value: '',
    })
  },
  bindChangeTextArea: function (e) {
    var that = this;
    // var value = e.detail.value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "`");
    
    // if(value.indexOf("`")){
    //   value = e.detail.value.replace(/`/g, "")
    //   wx.showToast({
    //     title: '暂不支持表情包使用哦~',
    //     icon:'none',
    //     duration: 2000
    //   })
    // }
    
    that.setData({
      value: e.detail.value,
    })
  },
  upload: function(){
    var that = this;
    //选择图片
    wx.chooseImage({//调起选择图片
      count: 6 - that.data.uploaderNum, // 默认6
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
        console.log('that.data.uploaderList')
        console.log(that.data.uploaderList)
        if (that.data.uploaderList.length == 6) {
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
   saveMsg:async function(){
     var that = this;
    //给接收者发系统消息和留言 
    // ORDER_ID SEND_ID SEND_NAME CONTENT PHOTO RECEIVE_ID RECEIVE_NAME 接收方是卖家 b_order_msg_details
    wx.showLoading({
      title: '保存中...',
    })
    var isEmoji = await that.isEmojiCharacter(that.data.value);
    if(isEmoji && isEmoji !=undefined){
      wx.showToast({
        title: '暂不支持表情包使用哦~',
        icon:'none',
        duration:2000
      })
      return
      // var content = that.data.value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    }else{
      var content = that.data.value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
    }
   console.log('输入文字')
   console.log(content)
    var receiveInfo = that.data.receiveInfo;
    var imgUrls = '';
    if(that.data.uploaderList.length >0 ){
      imgUrls =  await that.getImgUrl(that.data.uploaderList);
    }
    
    var p = {
      KID: -1,
      ORDER_ID: receiveInfo.orderId,
      SEND_USER_ID: app.getUser().id,
      SEND_USER_NAME: app.getUser().name,
      CONTENT: content, 
      PHOTO_URLS: imgUrls, 
      RECEIVE_USER_ID: receiveInfo.receiveId, 
      RECEIVE_USER_NAME: receiveInfo.receiveName
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_order_msg_details', '', p, 'POST').then((result) => {
      if (result != 'error') {
        wx.hideLoading()
        this.setData({
          uploaderNum: 0,
          uploaderList: [],
          showUpload: true,
        })
        that.sendSystemMsg()
      }
    })
   },
   sendSystemMsg:function(){
      var that = this;
      var receiveInfo = that.data.receiveInfo;
      var orderCode = receiveInfo.orderCode;
      //先插入消息表吧  给买家发消息 
      var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
      var p = {
        KID: -1,
        THEME:'消息提醒',
        USER_ID: receiveInfo.receiveId,
        USER_NAME: receiveInfo.receiveName,
        USER_PHONE: receiveInfo.receivePhone,
        CONTENT: '您的订单['+orderCode+"]有新的留言待查看",//商品名称
        STATUS: '已发送',
        SEND_TIME: time
      }
      app.ManageExecuteApi('/api/_cud/createAndUpdate/b_message', '', p, 'POST').then((result) => {   
        if (result != 'error') {
          console.log('发送成功')
          wx.showToast({
            title: '留言成功',
            icon:'none',
            duration:1500
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta:1
            }
            )
          },300)
        }
      })
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
  }
})