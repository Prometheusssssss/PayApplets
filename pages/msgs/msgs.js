const app = getApp()
// pages/msgs/msgs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [], //消息列表
    totalList: [],
    defaultPageSize: 30,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.lmFramework = that.selectComponent("#lm-framework");
    that.lmFramework.dealPageNoSize('enter');
    // this.getMsgData();
  },
  onShow:function(){
    var that = this;
    // that.lmFramework.dealPageNoSize('enter');
    // debugger
  },
  callBackPageSetData: function (e) {
    var that = this;
    that.setData(e.detail.returnSetObj)
  },
   //订单页面方法开始
   loadMainList: function (e) {
    var { pageNo, pageSize, type } = e.detail;
    var that = this;
    var p = {
      "tableName":"b_message",
      "page": pageNo,
      "limit": pageSize,
      "filters":[
          {
            "fieldName":"USER_ID",
            "type":"date",
            "compared":"=",
            "filterValue": app.getUser().id
          },
      ],
      "orderByField":"SEND_TIME",
      "isDesc":1
    }
    // var url = `/api/_search/defaultSearch/b_message?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.lmFramework.dealWithList(type, dataList, pageSize);
      }
    })
    
  
  },
  //加载数据
  getMsgData: function () {
    var that = this;
    var p = {
      "USER_ID": "1"//过滤userid
    }
    var url = `/api/_search/defaultSearch/b_message?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          msgList: result,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})