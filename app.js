global.base64 = require('/pages/public-js/base64Encode.js')
global.common = require('/pages/public-js/common.js')
App({
  onLaunch: function () {
    
  },
  globalData: {
    logsStorageList: [],
    developStorageList: [],

    bgAudioManagerInterval: null,
    addressPushInterval: null,

    hostUrl: '',
    systemInfo: {},
    platform: {},
    toastDuration: 1500,
    pageSize: 10,
    pageLargeSize: 30,
    userInfo: null,
    areaInfo:null,
    sliderBar: [],

    manageUrl: 'https://www.dazuiba.cloud', //体验
    // manageUrl: 'https://app.keyun.link', //体验
  },
  setHostUrl: function (hostUrl) {
    this.globalData.hostUrl = this.globalData.manageUrl + '/' + hostUrl;
  },
  setUser: function (user) {
    var that = this;
    this.globalData.userInfo = user;
  },

  getUser: function () {
    // var user = this.globalData.userInfo;
    var user = {id:1,name:'测试',tel:'15635678989'};
    return user;
  },

  setArea: function (areaInfo) {
    var that = this;
    this.globalData.areaInfo = areaInfo;
  },

  getArea: function () {
    var areaInfo = this.globalData.areaInfo;
    return areaInfo;
  },

  getToastDuration: function () {
    const toastDuration = this.globalData.toastDuration;
    return toastDuration;
  },

  getPageSize: function () {
    const pageSize = this.globalData.pageSize;
    return pageSize;
  },
  getPageLargeSize: function () {
    const pageLargeSize = this.globalData.pageLargeSize;
    return pageLargeSize;
  },
  ManageExecuteApi: async function (path, headerString, param, way) {
    var that = this;
    var header = {
      'Content-Type': 'application/json',
    }
    if (headerString) {
      header = {
        'Content-Type': 'application/json',
        'authorization': 'Basic ' + headerString,
      }
    }
    var result = await that.reTryRequest(that.globalData.manageUrl + '' + path, way, param, header);

    if (result == 'error') {
      return 'error'
    } else {
      return result
    }
  },
  // reTryRequest: function (url, method, data, header, retryTimes = 0) {
  //   var result =  new Promise(resolve => {
  //     wx.request({
  //       url: url,
  //       method: method, data: data, header: header,
  //       complete: function (res) {
  //         resolve(res);
  //       }
  //     })
  //   })
  //   // IS_SUCCESS  MSG  TABLE
  //   var data = result.data;
  //   if(!data.IS_SUCCESS){
  //     wx.showToast({
  //       title: data.MSG,
  //       icon: 'none',
  //       duration: 2000
  //     });
  //     return 'error'
  //   }else{
  //     return data.Table
  //   }
  // },
  reTryRequest: async function (url, method, data, header, retryTimes = 0) {
    var result = await new Promise(resolve => {
      wx.request({
        url: url,
        method: method, data: data, header: header,
        complete: function (res) {
          resolve(res);
        }
      })
    })
    // IS_SUCCESS  MSG  TABLE
    var data = result.data;
    if(!data.IS_SUCCESS){
      wx.showToast({
        title: data.MSG,
        icon: 'none',
        duration: 2000
      });
      return 'error'
    }else{
      return data.Table
    }
  },
  UploadImage: async function (p) {
    var that = this;
    var result = await that.reTryRequest(that.globalData.manageUrl+'/api/_oss/ossimg', 'POST', p, {});
    return result;
  },
})