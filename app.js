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

    manageUrl: 'https://app1.keyun.link:543', //体验
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