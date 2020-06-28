const app = getApp()
// pages/myPublish/myPublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalList: [],
    defaultPageSize: app.getPageSize(),
    searchText: '',
    selectStatus: '全部', //状态
    comboboxStatusList: [{
        NAME: '全部'
      },
      {
        NAME: '上架中'
      },
      {
        NAME: '待发货'
      },
      {
        NAME: '待收货'
      },
      {
        NAME: '已完成'
      },
      {
        NAME: '售后接入中'
      },
      {
        NAME: '已下架'
      }
    ],
    myPublishList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.lmFramework = that.selectComponent("#lm-framework");
  },
  onShow:function(){
    var that = this;
    that.lmFramework.dealPageNoSize('enter');
  },
  callBackPageSetData: function (e) {
    var that = this;
    that.setData(e.detail.returnSetObj)
  },
   //订单页面方法开始
   loadMainList: function (e) {
    var { pageNo, pageSize, type } = e.detail;
    var that = this;
    var data = that.data;
    if(data.selectStatus == '全部'){
      var p = {
        "tableName":"b_product_list",
        "page": pageNo,
        "limit": pageSize,
        "filters":[
            {
              "fieldName":"NAME",
              "type":"string",
              "compared":"like",
              "filterValue": data.searchText
            },
            {//卖家id
              "fieldName":"SELL_USER_ID",
              "type":"date",
              "compared":"=",
              "filterValue": 1
            },
        ]
      }
    }else{
      var status = data.selectStatus;
      var p = {
        "tableName":"b_product_list",
        "page": pageNo,
        "limit": pageSize,
        "filters":[
            {
              "fieldName":"NAME",
              "type":"string",
              "compared":"like",
              "filterValue": data.searchText
            },
            {
              "fieldName":"STATUS",
              "type":"date",
              "compared":"=",
              "filterValue": status
            },
            {//卖家id
              "fieldName":"SELL_USER_ID",
              "type":"date",
              "compared":"=",
              "filterValue": 1
            },
        ]
      }
    }
    console.log('查询数据')
    console.log(JSON.stringify(p))
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
  bindStatusCboChange: function (e) {
    var that = this;
    that.setData({
      selectStatus: that.data.comboboxStatusList[e.detail.value].NAME
    })
    that.lmFramework.dealPageNoSize('enter');
  },
})