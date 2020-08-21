global.base64 = require('/pages/public-js/base64Encode.js')
global.common = require('/pages/public-js/common.js')
//1、提现详情里付款结束后没有扣除用户的账户余额
//2、提现详情里要实时查一下用户的账户余额
//3、登录页面
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
    // manageUrl:'https://test.dazuiba.cloud',
    // manageUrl: 'https://app.keyun.link', //体验
  },
  setHostUrl: function (hostUrl) {
    this.globalData.hostUrl = this.globalData.manageUrl + '/' + hostUrl;
  },
  getJsCode: async function () {
    return await new Promise(re => {
      wx.login({
        success(res) {
          if (res.code) {
            var code = res.code;
            re(code);
          }
        }
      })
    })
  },
  setUser: function (user) {
    var that = this;
    that.globalData.userInfo = user;
  },

  getUser: function () {
    var that = this;
    var user = that.globalData.userInfo;
    // var user = {id:1,name:'测试',tel:'15635678989'};
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
  reTryPayRequest: async function (url, method, data, header, retryTimes = 0) {
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
    var data = result.data.Table;
    if(!data.IsSuccess){
      wx.showToast({
        title: data.ErroMessage,
        icon: 'none',
        duration: 2000
      });
      return 'error'
    }else{
      return JSON.parse(data.MSG)
    }
  },
  UploadImage: async function (p) {
    var that = this;
    var result = await that.reTryRequest(that.globalData.manageUrl+'/api/_oss/ossimg', 'POST', p, {});
    return result;
  },
  getPayMent: async function(price,productId,buyUserId,orderNo) {
    var that = this;
    var jsCode = await new Promise(resolve => {
      wx.login({
        success(newRes) {
          if (newRes.code) {
            resolve(newRes.code);
          }
        }
      })
    })
    // price productId buyUserId jsCode
    var result = await that.reTryPayRequest(that.globalData.manageUrl + '/api/_pay/WeChatServicesPayApi', 'POST', {
      price: price,
      productId: productId,
      buyUserId: buyUserId,
      jsCode: jsCode,
      orderNo: orderNo,
    }, {});
    if (result == 'error') {
      return 'error'
    } else {
      return result
    }
  },
  getRefund: async function (orderNo) {
    var that = this;
    var result = await that.reTryPayRequest(that.globalData.manageUrl + '/api/_pay/WeChatServicesRefundApi', 'POST', {
      orderNo: orderNo
    }, {});

    if (result == 'error') {
      return 'error'
    } else {
      return result
    }
  },
  randomString: function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
})