const app = getApp()
// pages/customerOrder/customerOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalList: [],
    defaultPageSize: app.getPageSize(),
    searchText: '',
    selectStatus: '', //状态
    selectType: '全部', //状态
    comboboxTypeList: [{
        NAME: '全部'
      },
      {
        NAME: '商品'
      }],
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
    var selectType = data.selectType;
    if (selectType == '全部') {
      filter = [{
          "fieldName": "PRODUCT_NAME,BUY_USER_PHONE,SELL_USER_PHONE,CODE",
          "type": "string",
          "compared": "like",
          "filterValue": data.searchText
        },
        // {
        //   "fieldName": "BUY_USER_PHONE",
        //   "type": "string",
        //   "compared": "like",
        //   "filterValue": data.searchText
        // },{
        //   "fieldName": "SELL_USER_PHONE",
        //   "type": "string",
        //   "compared": "like",
        //   "filterValue": data.searchText
        // },{
        //   "fieldName": "CODE",
        //   "type": "string",
        //   "compared": "like",
        //   "filterValue": data.searchText
        // },
        {
          "fieldName": "STATUS",
          "type": "date",
          "compared": "=",
          "filterValue": data.selectStatus
        },
      ];
    } else {
      filter = [{
        "fieldName": "PRODUCT_NAME,BUY_USER_PHONE,SELL_USER_PHONE,CODE",
        "type": "string",
        "compared": "like",
        "filterValue": data.searchText
      },
      {
          "fieldName": "STATUS",
          "type": "date",
          "compared": "=",
          "filterValue": data.selectStatus
        },
        {
          "fieldName": "TYPE",
          "type": "date",
          "compared": "=",
          "filterValue": selectType
        }
      ]
    }
    // isDesc 1代表倒序，0代表正序
    var p = {
      "tableName": "b_order",
      "page": pageNo,
      "limit": pageSize,
      "filters": filter,
      "orderByField": "ORDER_TIME",
      "isDesc":1
    }
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.lmFramework.dealWithList(type, dataList, pageSize);
      }
    })
  },
  searchList: function ({
    detail
  }) {
    var that = this;
    that.setData({
      searchText: detail
    })
    that.lmFramework.dealPageNoSize('enter');
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
  bindTypeCboChange: function (e) {
    var that = this;
    that.setData({
      selectType: that.data.comboboxTypeList[e.detail.value].NAME
    })
    that.lmFramework.dealPageNoSize('enter');
  },
  goCustomerOrderDetailPage: function(e){
    var that = this;
    var orderItem = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `customerOrder-detail?orderItem=${JSON.stringify(orderItem)}`,
    })
  },
})