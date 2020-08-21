// pages/guest-information/guest-information-add.js
const app = getApp()
const {
  common
} = global;
var compressor = require("../../assets/js/compressor-image.js");
// var covertPingYin = require("../../../pages/public-js/covertPingYin.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaIndex: 0,
    areaList: [],
    regionIndex: 0,
    regionList: [],
    serverIndex:0,
    serverList:[],

    areaId:'',
    regionId:'',
    serverId:'',

    pagetype: 'add',
    publishInfo: {},
    myForm: {},
    showLocationPageConfirm: false,
    // kid:-1,//发布商品信息的kid

    id:'',                        //上传时后端返回的图片ID,拼接后存入
    joinString:'',                 
    uploaderList: [],              //保存上传图片url的数组
    uploaderNum: 0,             //已经上传的图片数目
    showUpload: true,           //控制上传框的显隐

    detailId:'',
    joinDetailString:'',      
    uploaderDetailList: [],              //保存上传详情图片url的数组
    uploaderDetailNum: 0,             //已经上传的详情图片数目
    showDetailUpload: true,           //控制上传框的显隐
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var areaInfo = JSON.parse(options.areaInfo);
    var pagetype = that.data.pagetype;
    if(areaInfo != undefined && areaInfo != null){
      pagetype = areaInfo.type;
      that.setData({
        pagetype:pagetype
      })
    }
    if(pagetype == 'edit'){
      wx.setNavigationBarTitle({
        title: "编辑发布",
      });
      //获取对应的index
      var item = areaInfo.publishInfo;
      var uploaderList = [];
      var uploaderDetailList = [];
      if(item.PHOTO_URL != ''){
        uploaderList = item.PHOTO_URL.split(',');
      }
      if(item.DESC_PHOTO != ''){
          uploaderDetailList = item.DESC_PHOTO.split(',');
      }
      
      
      if(uploaderList.length>=1){
        that.setData({showUpload:false})
      }
      if(uploaderDetailList.length>=10){
        that.setData({showUpload:false})
      }
      that.setData({
        publishInfo: item,
        areaIndex: areaInfo.areaIndex,
        areaId: areaInfo.areaId,
        regionId: areaInfo.regionId,
        serverId: areaInfo.serverId,
        uploaderList: uploaderList,
        uploaderDetailList: uploaderDetailList,
      })
    }else{
      wx.setNavigationBarTitle({
        title: "新增发布",
      });
      var publishInfo = {
        DESCRIPTION: '',
      };
      that.setData({
        publishInfo: publishInfo
      })
    }
  },

  onShow: function(){
    var that = this;
    that.loadArea();
  },
  loadArea:function(){
    var that = this;
    var p = {"PARENT_ID":null}
    var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
    console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          areaList : result,
        })
        that.loadRegion()
      }
    })
  },
  loadRegion:function(){
    var that = this;
    //根据当前大区id去找 大区的index
    var areaIndex = that.data.areaIndex;
    var parentId = that.data.areaList[areaIndex].KID;
    var p = {"PARENT_ID":parentId}
   var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
   console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          regionList : result,
        })
        that.loadServer()
      }
    })
  },
  loadServer:function(){
    var that = this;
    var data = that.data;
    var regionIndex = data.regionIndex;
    if(data.regionId != ''){
      regionIndex = data.regionList.findIndex((region)=>region.KID == data.regionId); 
    }
    
    that.setData({
      regionIndex:regionIndex
    })
    var parentId = that.data.regionList[regionIndex].KID;
    var p = {"PARENT_ID":parentId}
   var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
   console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        // var data = result;
        var serverIndex = data.serverIndex;
        if(data.serverId != ''){
          serverIndex =result.findIndex((server)=>server.KID == data.serverId); 
        }
        
        that.setData({
          serverList : result,
          serverIndex: serverIndex
        })
      }
    })
  },
  //
  bindAreaChange:function(e){
    var that = this;
    var areaId = that.data.areaList[e.detail.value].KID;
    that.setData({
      areaIndex: e.detail.value,
      areaId: areaId
    })
    that.loadRegion()
  },

  bindServerChange: function (e) {
    var that = this;
    var regionIndex = that.data.regionIndex;
    var regionId = that.data.regionList[regionIndex].KID;
    var areaId = that.data.areaList[that.data.areaIndex].KID;
    var serverId = that.data.serverList[that.data.serverIndex].KID;
    wx.navigateTo({url:`../order/order-slider?regionId=${regionId}&&areaId=${areaId}&&serverId=${serverId}&&regionIndex=${that.data.regionIndex}&&areaIndex=${that.data.areaIndex}&&serverIndex=${that.data.serverIndex}`})
    

  },
 
  remarkEvent: function(e){
    var that = this;
    var publishInfo = that.data.publishInfo;
    var value = publishInfo.DESCRIPTION == undefined ? '' : publishInfo.DESCRIPTION;
    
      var updatelocalText = "publishInfo.DESCRIPTION";
      var title = "商品详情"
      wx.navigateTo({
        url: `../../../../common-page/remark?type=local&value=${value}&updatelocalText=${updatelocalText}&title=${title}`,
      })
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
        console.log('that.data.uploaderList')
        console.log(that.data.uploaderList)
        if (that.data.uploaderList.length == 1) {
          that.setData({
            showUpload:false
          })
        }

        

        //图片选择完就可以显示在本地，可以提交的时候再去存入oss，换入可直接访问的图片链接，存入数据库
        //将压缩或者不压缩图片本地连接上传给oss，oss返回带域名可以直接访问的图片链接，本地将图片链接逗号拼接，保存的时候存入数据库
        // for (var i = 0; i < uploaderList.length; i++) {
        //   wx.uploadFile({
        //     url: 'xxxxx',
        //     filePath: uploaderList[i],
        //     name: 'files',
        //     formData: {
        //       files: uploaderList,
        //     },
        //     success: function (res) {
        //        var id = JSON.parse(res.data).data.attId
        //         that.setData({
        //         id: that.data.id + `${id},`,
        //         joinString: (that.data.id + `${id},`).slice(0, -1)
        //       })
        //     }
        //   })
        // }
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
            // that.setData({
            //   joinString:newArr,
            //   id:newArr+','
            // })
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

   upDetailload: function(){
    var that = this;
    //选择图片
    wx.chooseImage({//调起选择图片
      count: 10 - that.data.uploaderDetailNum, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.data.uploaderDetailList.concat(res.tempFilePaths);
        var uploaderDetailList = res.tempFilePaths;
        that.setData({
          uploaderDetailList: that.data.uploaderDetailList.concat(res.tempFilePaths),
        })
        that.setData({
          uploaderDetailNum: that.data.uploaderDetailList.length
        })
        if (that.data.uploaderDetailList.length == 10) {
          that.setData({
            showDetailUpload:false
          })
          console.log(that.showDetailUpload)
        }
        //图片选择完就可以显示在本地，可以提交的时候再去存入oss，换入可直接访问的图片链接，存入数据库
        //将压缩或者不压缩图片本地连接上传给oss，oss返回带域名可以直接访问的图片链接，本地将图片链接逗号拼接，保存的时候存入数据库
        // for (var i = 0; i < uploaderDetailList.length; i++) {
        //   wx.uploadFile({
        //     url: 'xxxxx',
        //     filePath: uploaderDetailList[i],
        //     name: 'files',
        //     formData: {
        //       files: uploaderDetailList,
        //     },
        //     success: function (res) {
        //        var id = JSON.parse(res.data).data.attId
        //         that.setData({
        //         detailId: that.data.id + `${id},`,
        //         joinDetailString: (that.data.id + `${id},`).slice(0, -1)
        //       })
        //     }
        //   })
        // }
      }
    })
  },
  //展示图片
  showDetailImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderDetailList,
      current: that.data.uploaderDetailList[e.currentTarget.dataset.index]
    })
  },
 // 删除图片
  clearDetailImg: function (e) {
    var that = this
    var nowList = [];//新数据
    var uploaderDetailList = that.data.uploaderDetailList;//原数据
    
    for (let i = 0; i < uploaderDetailList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        var arr = that.data.joinDetailString.split(',')
            arr.splice(i, 1);                              //删除图片的同时删除掉其对应的ID
            var newArr = arr.join(',')
            // that.setData({
            //   joinDetailString:newArr,
            //   detailId:newArr+','
            // })
      } else {
        nowList.push(uploaderDetailList[i])
      }
    }
    this.setData({
      uploaderDetailNum: this.data.uploaderNum - 1,
      uploaderDetailList: nowList,
      showDetailUpload: true,
    })
   },

  saveGuestValue: async function (e) {
    var that = this;
    var data = that.data;
    var form = e.detail.value;
    // 校验必填项，专区，大区，价格（非空数字），商品名称，
    var areaName = data.areaList[data.areaIndex].NAME;
    var serverName = data.serverList[data.serverIndex].NAME;
    var authorizeSeller = app.getUser().authorizeSeller;
    //没有卖家授权
    if(!authorizeSeller){
      wx.showToast({
        title:'当前仅限授权卖家发布商品，如需开通卖家功能请联系客服',
        icon:'none',
        duration:2000
      })
      return
    }
    var isEmoji = await that.isEmojiCharacter(form.NAME);
    if(isEmoji && isEmoji !=undefined){
      wx.showToast({
        title: '暂不支持表情包使用哦~',
        icon:'none',
        duration:2000
      })
      return
    }
    if (common.validators.isEmptyText(areaName, '游戏专区')||common.validators.isEmptyText(serverName, '游戏大区') || common.validators.isEmptyText(form.NAME, '商品名称') ) {
      return;
    }
    if (common.validators.isInValidNum(form.PRICE, '价格') ) {
      return;
    }
    wx.showLoading({
      title: '保存中...',
    })
    
    // //获取可以压缩的图片
    var uploaderImgList = data.uploaderList.concat(data.uploaderDetailList);
    var mainImgUrl = '';
    var detailImgUrl = '';
    var imgUrls = '';
    imgUrls =  await that.getImgUrl(uploaderImgList);
    if(imgUrls != ''){
      var imgList = imgUrls.split(',');
      mainImgUrl = imgList[0];
      detailImgUrl = imgList.slice(1,imgList.length).toString()
    }

    //商品表多存一个二级区的id和name 不然编辑的时候不好找到服务器

    var timestamp = Date.parse(new Date());
     var dayNum = 7;
     var newtimestamp = timestamp + (dayNum * 24) * 60 * 60 * 1000;
    var shelfTime = common.time.formatTimeTwo(timestamp/1000,'Y-M-D h:m:s');
    var offTime = common.time.formatTimeTwo(newtimestamp/1000,'Y-M-D h:m:s');
    var p = {
      KID: that.data.publishInfo.KID,
      NAME:form.NAME,//商品名称
      NEED_LEVEL:form.NEED_LEVEL,
      DESCRIPTION: data.publishInfo.DESCRIPTION,//商品详情
      // STATUS:'上架中',//状态
      // TYPE:'商品',//商品
      // SELL_USER_ID:1,//卖家id
      // SELL_USER_NAME:'耗子',//卖家昵称
      // SELL_USER_PHONE:'15736879889',//卖家手机号
      PRICE: form.PRICE,//价格
      PHOTO_URL: mainImgUrl,//主图
      DESC_PHOTO: detailImgUrl,//详情图
      GAME_PARTITION_KID: data.areaList[data.areaIndex].KID,//游戏大区
      GAME_PARTITION_NAME: areaName,
      GAME_SECONDARY_KID: data.regionList[data.regionIndex].KID,//游戏二级区
      GAME_SECONDARY_NAME: data.regionList[data.regionIndex].NAME,//游戏二级区
      GAME_ZONE_KID: data.serverList[data.serverIndex].KID,//服务器
      GAME_ZONE_NAME: serverName,
      // SHELF_TIME: shelfTime,
      // OFF_SHELF_TIME: offTime
    }
  
    console.log('发布')
    console.log(JSON.stringify(p))
    that.createProduct(p)
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
  //发布商品
  createProduct: function (p) {
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_product_list', '', p, 'POST').then((result) => {
      wx.hideLoading()
      if (result != 'error') {
        this.setData({
          uploaderNum: 0,
          uploaderList: [],
          showUpload: true,
          uploaderDetailNum: 0,
          uploaderDetailList: [],
          showDetailUpload: true,
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },200)
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1500
        })
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
  }



})