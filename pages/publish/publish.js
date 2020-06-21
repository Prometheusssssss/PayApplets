// pages/guest-information/guest-information-add.js
const app = getApp()
const {
  common
} = global;
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
    pagetype: 'add',
    publishInfo: {},
    myForm: {},
    showLocationPageConfirm: false,
    id:'',                        //上传时后端返回的图片ID,拼接后存入
    joinString:'',                    
    joinDetailString:'',                    
    uploaderList: [],              //保存上传图片url的数组
    uploaderDetailList: [],              //保存上传详情图片url的数组
    uploaderNum: 0,             //已经上传的图片数目
    uploaderDetailNum: 0,             //已经上传的详情图片数目
    showUpload: true,           //控制上传框的显隐
    showDetailUpload: true,           //控制上传框的显隐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pagetype = options.type;
    var setData = {
      pagetype: pagetype,
    }
    if(pagetype == 'edit'){
      wx.setNavigationBarTitle({
        title: "编辑发布",
      });
      var publishInfo = JSON.parse(options.info);
      //获取对应deindex
      that.setData({
        publishInfo: publishInfo
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
    var regionIndex = that.data.regionIndex;
    var parentId = that.data.regionList[regionIndex].KID;
    var p = {"PARENT_ID":parentId}
   var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
   console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          serverList : result
        })
      }
    })
  },
  //
  bindAreaChange:function(e){
    var that = this;
    var areaId = that.data.areaList[e.detail.value].KID;
    that.setData({
      areaIndex: e.detail.value
    })
    that.loadRegion()
  },

  bindServerChange: function (e) {
    var that = this;
    var regionIndex = that.data.regionIndex;
    var regionId = that.data.regionList[regionIndex].KID;
    var areaId = that.data.areaList[that.data.areaIndex].KID;
    var serverId = that.data.serverList[that.data.serverIndex].KID;
    debugger;
    wx.navigateTo({url:`../order/order-slider?regionId=${regionId}&&areaId=${areaId}&&serverId=${serverId}&regionIndex=${that.data.regionIndex}&&areaIndex=${that.data.areaIndex}&&serverIndex=${that.data.serverIndex}`})
    

  },
 
  remarkEvent: function(e){
    var that = this;
    var publishInfo = that.data.publishInfo;
    var value = publishInfo.DESCRIPTION == undefined ? '' : publishInfo.DESCRIPTION;
    // debugger
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
        debugger
        if (uploaderList.length == 6) {
          that.setData({
            showUpload:false
          })
          console.log(that.showUpload)
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
    debugger
    var that = this
    var nowList = [];//新数据
    var uploaderList = that.data.uploaderList;//原数据
    
    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        var arr = that.data.joinString.split(',')
            arr.splice(i, 1);                              //删除图片的同时删除掉其对应的ID
            var newArr = arr.join(',')
            that.setData({
              joinString:newArr,
              id:newArr+','
            })
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


  saveGuestValue: function (e) {
    var that = this;
    var form = e.detail.value;
    var myForm = that.data.myForm;
    // var location = that.data.locationArr;
    var settlementWayIndex = that.data.settlementWayIndex;
    var settlementWay = that.data.settlementWay;
    var quotationGroupIndex = that.data.quotationGroupIndex;
    var quotationGroup = that.data.quotationGroup;
    var customerKid;
    // 客户名称省份城市区域销售人员必填 缺少“分拣码”、“公司邮编”、“网址”输入项
    if (common.validators.isEmptyText(that.data.customerInfo.REGION_ID, '片区')||common.validators.isEmptyText(form.CUSTOMER_NAME, '客户名称') || common.validators.isEmptyText(settlementWay[settlementWayIndex].VALUE, '结算方式') ) {
      // || common.validators.isEmptyText(that.data.customerInfo.SALESMAN, '销售人员')
      return;
    }

    var p = {
      'KID': customerKid,
      'CID': app.getUser().cid,
      'CRT_CODE': app.getUser().code,
      'CUSTOMER_NAME': form.CUSTOMER_NAME,
      'ABBREVIATION': form.ABBREVIATION,
      'RETRIEVAL': form.RETRIEVAL,
      'COMPANY_ADDR': form.COMPANY_ADDR,
      'COMPANY_TEL': form.COMPANY_TEL,
      'FAX': form.FAX,
      'PAYMENT_DAYS': form.PAYMENT_DAYS,
      'PAYMENT_WAY': settlementWay[settlementWayIndex].VALUE,
      'DEPOSIT_BANK': form.DEPOSIT_BANK,
      'BANK_ACCOUNT': form.BANK_ACCOUNT,
      'TAX_FONT': form.TAX_FONT,
      'COMPANY_POSTCODE': form.COMPANY_POSTCODE,
      'URL': form.URL,
      'SORT_CODE': form.SORT_CODE,
      'REMARK': form.REMARK,
      // 'SALESMAN': that.data.customerInfo.SALESMAN,//add 
      // 'SALESMAN_ID': that.data.customerInfo.SALESMAN_ID,//add
      "REGION_ID": that.data.customerInfo.REGION_ID,
      "REGION": that.data.customerInfo.REGION,
      "CHANNEL_ID": that.data.customerInfo.CHANNEL_ID,
      "CHANNEL": that.data.customerInfo.CHANNEL,
      "CUSTOMER_LEVEL_ID": that.data.customerInfo.CUSTOMER_LEVEL_ID,
      "CUSTOMER_LEVEL": that.data.customerInfo.CUSTOMER_LEVEL,
      "QUOTATION_GROUP": quotationGroup[quotationGroupIndex].KID,//add
      "CONTACT_NAME": form.CONTACT_NAME,
      "CONTACT_TEL": form.CONTACT_TEL,
      'LATITUDE': myForm.LATITUDE,
      'LONGITUDE': myForm.LONGITUDE,
      'IS_ENABLE': (that.data.customerInfo.IS_ENABLE == undefined || that.data.customerInfo.IS_ENABLE == 0) ? 0 : 1,
    }

    if (that.data.pagetype == 'add') {
      p.KID = -1;
    }
    else {
      p.KID = that.data.customerInfo.KID;
    }

    that.createCutomer(p)
  },

 



})