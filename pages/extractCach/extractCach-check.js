// pages/extractCach/extractCach-check.js
const app = getApp()
const {common} =global
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker:false,
    searchText:'', totalList: [],
    defaultPageSize: app.getPageSize(),
    startTime: '',
    endTime: '',
    selectStatus:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.lmFramework = that.selectComponent("#lm-framework");
  },
  onShow: function () {
    var that = this;
    that.lmFramework.dealPageNoSize('enter');
  },
  callBackPageSetData: function (e) {
    var that = this;
    that.setData(e.detail.returnSetObj)
  },
  //订单页面方法开始
  loadMainList: function (e) {
    var {
      pageNo,
      pageSize,
      type
    } = e.detail;
    var that = this;
    var data = that.data;
    var filter = [];
    filter = [{
      "fieldName": "USER_NAME,USER_PHONE",
      "type": "string",
      "compared": "like",
      "filterValue": data.searchText
    },
    {
      "fieldName": "STATUS",
      "type": "date",
      "compared": "=",
      "filterValue": data.selectStatus
    }, { //卖家id
      "fieldName": "APPLICATION_TIME",
      "type": "date",
      "compared": ">",
      "filterValue": that.data.startTime
    },
    { //卖家id
      "fieldName": "APPLICATION_TIME",
      "type": "date",
      "compared": "<",
      "filterValue": that.data.endTime
    },
  ];
    var p = {
      "tableName": "b_withdrawal",
      "page": pageNo,
      "limit": pageSize,
      "filters": filter,
      "orderByField":"APPLICATION_TIME",
      "isDesc": '1'
    }
    console.log('查询数据')
    console.log(JSON.stringify(p))
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.lmFramework.dealWithList(type, dataList, pageSize);
      }
    })
  },
  
  searchList:function({
    detail
  }){
    var that = this;
    that.setData({searchText:detail})
    that.lmFramework.dealPageNoSize('enter')
  },
  changeCurrentSegment: function ({
    detail
  }) {
    var that = this;
    that.setData({
      selectStatus: detail.key
    })
    that.lmFramework.dealPageNoSize('enter');
  },
  searchDateViewPickerChange: function ({
    detail
  }) {
    var that = this;
    var endTime = common.time.addOneDay(detail.date2);
    console.log('endTime')
    console.log(endTime)
    // debugger
    // var newDay = common.time.formatDay(new Date(endTime))
    // console.log('newDay')
    // console.log(newDay)
    that.setData({
      startTime: detail.date1,
      endTime: endTime
    })
    if (that.lmFramework != undefined) {
      that.lmFramework.dealPageNoSize('enter');
    }
  },
  goExtractCheckDetailPage:function(e){
    var that = this;
    var extractInfo = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `extractCach-detail?extractInfo=${JSON.stringify(extractInfo)}`,
    })
  }
})