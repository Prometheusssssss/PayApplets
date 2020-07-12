// pages/extractCach/extractCach-record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalList: [],
    defaultPageSize: app.getPageSize(),
    startTime: '',
    endTime: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.lmFramework = that.selectComponent("#lm-framework");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that =this;
    that.lmFramework.dealPageNoSize('enter')
  },
  callBackPageSetData: function (e) {
    var that = this;
    console.log(e.detail.returnSetObj.totalList[0])
    that.setData(e.detail.returnSetObj)
  },

  loadMainList: function (e) {
    var {
      pageNo,
      pageSize,
      type
    } = e.detail;
    var that = this;
    var data = that.data;
    var filter = [];
   var filter = [
    { //卖家id
      "fieldName": "APPLICATION_TIME",
      "type": "date",
      "compared": ">",
      "filterValue": that.data.startTime
    },
    { //卖家id
      "fieldName": "APPLICATION_TIME",
      "type": "date",
      "compared": "<=",
      "filterValue": that.data.endTime
    },
  ]
    var p = {
      "tableName": "b_withdrawal",
      "page": pageNo,
      "limit": pageSize,
      "filters": filter
    }
    console.log('查询数据')
    console.log(JSON.stringify(p))
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.lmFramework.dealWithList(type, dataList, pageSize);
      }
    })
  },
  searchDateViewPickerChange: function ({
    detail
  }) {
    var that = this;
    that.setData({
      startTime: detail.date1,
      endTime: detail.date2
    })
    if (that.lmFramework != undefined) {
      that.lmFramework.dealPageNoSize('enter');
    }
  },

})