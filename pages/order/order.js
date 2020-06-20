// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   searchText:'',
   areaIndex:0,//大区
   regionIndex:0,//小区
   areaList:[],
   regionList:[],
  //  pickerList:[{
  //   KID:0,
  //   NAME:'笑傲专区'},{
  //   KID:1,
  //   NAME:'滴游区'}
  //  ],
   orderList:[{
    KID:1,
    PRODUCT_NAME:'天刀爆款',
    PRICE: '98',
    SELLER_ID:1,//买家id
    SELLER_TEL:'15736876465',//手机号可以发布的时候必填？？？
    SELLER_NICK:'nick',
    GAME_AREA:'新笑奥江湖',//专区
    GAME_AREA_ID:1,//专区
    GAME_REGION:'一站到底',//大区
    GAME_REGION_ID:'1',//大区
    DETAIL_IMG:'https://img.yxbao.com/pic/201307/25/1374743137_pm.jpg,https://img.yxbao.com/pic/201307/25/1374743139_zh.jpg',//string  字符串拼接 多条 字段长度给长一点
    DETAIL_DESC:'爆款装备来抢！',//商品详情描述
    BUYER_REMARK:'',//买家备注
    MAIN_IMG:'https://img.yxbao.com/pic/201307/25/1374743139_zh.jpg'
   }],
   gameArea:[{
      KID:0,
      NAME:'第一大区'
    },
    {
      KID:1,
      NAME:'第二区'
    }
   ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.sjFramework = that.selectComponent("#lm-framework");
  },

  // http://www.dazuiba.cloud:8001/api/_search/defaultSearch/a_game_setting?filter={"PARENT_ID":null}


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.loadArea();
    // that.loadGre();
    // that.sjFramework.dealPageNoSize('enter');
  },
  loadArea:function(){
    // http://www.dazuiba.cloud:8001/api/_search/defaultSearch/a_game_setting?filter={"PARENT_ID":null}
    var p = {"PARENT_ID":null}
    var url = `https://www.dazuiba.cloud/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
    console.log(url)
    wx.request({
      url: `${url}`,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        debugger
      }
    })
    // app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
    //   if (result != 'error') {
    //     var data = result;
    //     that.setData({
    //       areaList : result
    //     })
    //     that.loadRegion()
    //   }
    // })
  },
  loadRegion:function(){
    // http://www.dazuiba.cloud:8001/api/_search/defaultSearch/a_game_setting?filter={"PARENT_ID":null}
    var that = this;
    var parengId = that.data.areaList[0].KID;
    var p = {"PARENT_ID":parengId}
   var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
   console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          regionList : result
        })
      }
    })
  },
  callBackPageSetData: function (e) {
    var that = this;
    that.setData(e.detail.returnSetObj)
  },
  //订单页面方法开始
  loadMainList: function (e) {
    var { pageNo, pageSize, type } = e.detail;
    var that = this;
    that.sjFramework.dealWithList(type, [], pageSize);
    // var p = {
    //   id: that.data.customerList[that.data.customerIndex].KID,
    //   salesman_id: app.getUser().id,
    //   cid: app.getUser().cid,
    //   cid: app.getUser().cid,
    //   page_size: pageSize,
    //   page_no: pageNo,
    // }

    // app.ExecuteProcess('sel_sales_order_kyl', p).then((list) => {
    //   var dataList = common.arrayProcessing.convertStatusCss(list, 'sales-order');
    //   that.sjFramework.dealWithList(type, dataList, pageSize);
    // })
  },
  searchList: function ({
    detail
  }) {
    var that = this;
    that.setData({
      searchText: detail
    })
    // that.sjFramework.dealPageNoSize('enter');
  },
  bindPickerChange:function(e){
    var that = this;
    that.setData({
      pickerIndex: e.detail.value
    })
  },
  bindGameAreaPickerChange:function(e){
    var that = this;
    // debugger
    that.setData({
      gameAreaIndex: e.detail.value
    })
  },
  //立即购买进入详情页
  openOrderDetailPage:function(e){
    var that = this;
    var item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({url:`order-detail?detailData=${item}`})
  },
  //先拉出大区 默认给一个值
  selectSlider:function(){
    var areaId = 0;
    wx.navigateTo({url:`order-slider?${areaId}`})
  }
})