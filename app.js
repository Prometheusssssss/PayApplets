//app.js
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
    sliderBar: [],

    manageUrl: 'https://www.dazuiba.cloud', //体验
    // manageUrl: 'https://app.keyun.link', //体验
  },
  setHostUrl: function (hostUrl) {
    this.globalData.hostUrl = this.globalData.manageUrl + '/' + hostUrl;
  },
  setUser: function (user) {
    var that = this;
    that.showPhoneLog(user);
    this.globalData.userInfo = user;
  },

  getUser: function () {
    var user = this.globalData.userInfo;
    return user;
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
    // return result
    if (result == 'error') {
      return 'error'
    } else {
      return result
    }
  },
  reTryRequest: async function (url, method, data, header, retryTimes = 0) {
    var that = this;
    // that.showPhoneLog(`请求开始！！！！！！请求方式:${method}||请求路径:${url}||头部:${JSON.stringify(header)}||参数:${JSON.stringify(data)}！！！！！`);
    var result = await new Promise(resolve => {
      wx.request({
        url: url,
        method: method, data: data, header: header,
        complete: function (res) {
          // debugger
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
  // GetDBSliderBarList: function () {
  //   var that = this;
  //   var p = {
  //     store_code: that.getStore().CODE,
  //     cid: that.getUser().cid,
  //   }
  //   //获取当前选中客户的产品类别
  //   that.ExecuteProcess('sel_customer_product_category_sjn', p).then((slider) => {
  //     that.globalData.sliderBar = slider;
  //   })
  // },
  // clearLogsStorageList: function () {
  //   this.globalData.logsStorageList = [];
  // },

  // setLogsStorageList: function (item) {
  //   this.globalData.logsStorageList.unshift(item)
  // },

  // getLogsStorageList: function () {
  //   return this.globalData.logsStorageList;
  // },

  // clearDevelopLogsStorageList: function () {
  //   this.globalData.developStorageList = [];
  // },

  // setDevelopLogsStorageList: function (item) {
  //   this.globalData.developStorageList.unshift(item)
  // },

  // getDevelopLogsStorageList: function () {
  //   return this.globalData.developStorageList;
  // },
})