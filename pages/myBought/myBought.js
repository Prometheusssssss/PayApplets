const app = getApp()
const {
  common
} = global;
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
      "filters": filter,
      "orderByField": "ORDER_TIME",
      "isDesc":1
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
    // /api/_cud/confirmedOrder
    var p = {
      KID: order.KID
    }
     //确认收货 发消息给卖家，主题交易完成提醒，买家已收货；；更新订单状态为已完成; 更新用户表，卖家累计受益和可用资金都会增加，即将收入减少
    app.ManageExecuteApi('/api/_cud/confirmedOrder', '', p, 'POST').then((result) => {
      if (result != 'error') {
        //成功之后插入账户流水为支出类型流水 调用流水表插入数据
        wx.showToast({
          title: '确认收货成功',
          icon: 'none',
          duration: 1500
        })
        that.lmFramework.dealPageNoSize('enter')
      }
    })
  },
  //提醒收货 给买家消息表插入消息，或者给公众号发消息
  remindShip: function(e){
    var that = this;
    var item = e.target.dataset.item;
    //先插入消息表吧  给买家发消息 
    var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    var p = {
      KID:-1,
      THEME:'发货提醒',
      USER_ID: item.SELL_USER_ID,
      USER_NAME: item.SELL_USER_NAME,
      USER_PHONE: item.SELL_USER_PHONE,
      CONTENT: "您的宝贝“"+item.PRODUCT_NAME+"”已被拍下，买家提醒您注意及时发货。",//商品名称
      STATUS: '已发送' ,
      SEND_TIME: time
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_message', '', p, 'POST').then((result) => {   
      if (result != 'error') {
        console.log('发送成功')
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
      url: `../myBought/myBought-detail?orderItem=${JSON.stringify(orderItem)}`,
    })
  }
})