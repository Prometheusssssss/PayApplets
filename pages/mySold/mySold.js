const app = getApp()
const {
  common
} = global;
// pages/mySold/mySold.js
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
      // {
      //   NAME: '代练'
      // }
    ],
    // currentSegment: '',
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
    //我卖的 是作为卖家存在
    if (selectType == '全部') {
      filter = [{
          "fieldName": "PRODUCT_NAME",
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
        { //卖家id
          "fieldName": "SELL_USER_ID",
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
        { //卖家id
          "fieldName": "SELL_USER_ID",
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
      "filters": filter,
      "orderByField": "ORDER_TIME",
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
  // 待发货 卖家点击发货状态变成待收货，卖家点击提醒收货给对应的买家发送一条收货提醒
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
  //客服接入可能要接入客服消息，确认一下客服介入之后要不要改变订单状态为，售后接入
  handleContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  //发货 更改订单状态为待收货
  ship: function(e){
    var that = this;
    var order = e.target.dataset.item;
    var p = {
      KID: order.KID,
      STATUS: '待收货',
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_order', '', p, 'POST').then((result) => {
      if (result != 'error') {
        //更新订单
        wx.showToast({
          title: '发货成功',
          icon: 'none',
          duration: 1500
        })
        // 给买家发消息
        that.shipMsg(order)
        that.lmFramework.dealPageNoSize('enter');
      }
    })
  },
  shipMsg:function(order){
    var that = this;
    var item = order;
    // debugger
    //先插入消息表吧  给买家发消息 
    var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    var p = {
      THEME:'发货提醒',
      USER_ID: item.BUY_USER_ID,
      USER_NAME: item.BUY_USER_NAME,
      USER_PHONE: item.BUY_USER_PHONE,
      CONTENT: '您的宝贝卖家已发货',//商品名称
      STATUS: "已发送",
      SEND_TIME: time
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_message', '', p, 'POST').then((result) => {   
      if (result != 'error') {
    
      }
    })

  },
  //提醒收货 给买家消息表插入消息，或者给公众号发消息
  remindReceipt: function(e){
    var that = this;
    var item = e.target.dataset.item;
    // debugger
    //先插入消息表吧  给买家发消息 
    var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    var p = {
      THEME:'收货提醒',
      USER_ID: item.BUY_USER_ID,
      USER_NAME: item.BUY_USER_NAME,
      USER_PHONE: item.BUY_USER_PHONE,
      CONTENT: '请尽快确认收货',//商品名称
      STATUS: "已发送",
      SEND_TIME: time
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_message', '', p, 'POST').then((result) => {   
      if (result != 'error') {
        wx.showToast({
          title: '提醒成功',
          icon:'none',
          duration:1500
        })
      }
    })
    
  },

  goCustomerOrderDetailPage:function(e){
    var that = this;
    var orderItem = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `../customerOrder/customerOrder-detail?orderItem=${JSON.stringify(orderItem)}`,
    })
  }
})