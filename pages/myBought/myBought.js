const app = getApp()
// pages/myBought/myBought.js
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
      },
      {
        NAME: '代练'
      }
    ]
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
    var id = app.getUser().id
    //我买的 是作为买家存在
    if (selectType == '全部') {
      filter = [{
          "fieldName": "NAME",
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
        { //买家id
          "fieldName": "BUY_USER_ID",
          "type": "date",
          "compared": "=",
          "filterValue": id
        },
      ];
    } else {
      filter = [{
          "fieldName": "NAME",
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
        },
        { //买家id
          "fieldName": "BUY_USER_ID",
          "type": "date",
          "compared": "=",
          "filterValue": id
        },
      ]
    }
    var p = {
      "tableName": "b_order",
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
  //客服接入可能要接入客服消息
  handleContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  //确认收货 更改订单状态为已完成
  confirmReceipt: function(e){
    var that = this;
    var order = e.target.dataset.item;
    var p = {
      KID: order.KID,
      STATUS: '已完成',
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_order', '', p, 'POST').then((result) => {
      if (result != 'error') {
        //更新订单
        wx.showToast({
          title: '发货成功',
          icon: 'none',
          duration: 1500
        })
        that.lmFramework.dealPageNoSize('enter');
      }
    })
  },
  //提醒收货 给买家消息表插入消息，或者给公众号发消息
  remindShip: function(e){
    var that = this;
    var order = e.target.dataset.item;
    
  },
})