// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   totalList: [],
   defaultPageSize: app.getPageSize(),

   searchText:"",
   areaIndex:0,//大区
   regionIndex:0,//小区
   serverIndex:0,//小区
   areaId:0,//大区
   regionId:0,//小区
   serverId:0,//小区
   areaList:[],
   regionList:[],
   serverList:[],
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
  onShow: async function () {
    var that = this;
    await that.loadArea();
    // that.sjFramework.dealPageNoSize('enter');
  },
  loadArea: async function(){
    var that = this;
    var p = {"PARENT_ID":null}
    var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
    console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          areaList : result,
        })
        that.loadRegion()
      }
    })
  },
  loadRegion:function(){
    var that = this;
    var areaIndex = that.data.areaIndex;
    var parentId = that.data.areaList[areaIndex].KID;
    var p = {"PARENT_ID":parentId}
   var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
   console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          regionList : result,
        })
        that.loadServer()
      }
    })
  },
  loadServer:function(){
    var that = this;
    var regionIndex = that.data.regionIndex;
    var parentId = that.data.regionList[regionIndex].KID;
    var p = {"PARENT_ID":parentId}
   var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
   console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          serverList : result
        })
        that.sjFramework.dealPageNoSize('enter');
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
    var data = that.data;
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
              "fieldName":"PRICE",
              "type":"string",
              "compared":"like",
              "filterValue": data.searchText
            },
            {
              "fieldName":"GAME_ZONE_KID",
              "type":"date",
              "compared":"=",
              "filterValue": data.serverList[data.serverIndex].KID
            },
            {//卖家id
              "fieldName":"SELL_USER_ID",
              "type":"date",
              "compared":"=",
              "filterValue": 1
            },
        ]
    }
    console.log('查询报错')
    console.log(JSON.stringify(p))
    app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
      if (dataList != 'error') {
        that.sjFramework.dealWithList(type, dataList, pageSize);
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
    that.sjFramework.dealPageNoSize('enter');
  },
  bindAreaChange:function(e){
    var that = this;
    var areaId = that.data.areaList[e.detail.value].KID;
    that.setData({
      areaIndex: e.detail.value
    })
    that.loadRegion();
    that.sjFramework.dealPageNoSize('enter');
  },
  
  //立即购买进入详情页
  openOrderDetailPage:function(e){
    var that = this;
    var item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({url:`order-detail?detailData=${item}`})
  },
 
  //先拉出大区 默认给一个值  选择完小区返回页面
  selectSlider:function(){
    var that = this;
    var regionIndex = that.data.regionIndex;
    var regionId = that.data.regionList[regionIndex].KID;
    var areaId = that.data.areaList[that.data.areaIndex].KID;
    var serverId = that.data.serverList[that.data.serverIndex].KID;
    wx.navigateTo({url:`order-slider?regionId=${regionId}&&areaId=${areaId}&&serverId=${serverId}&regionIndex=${that.data.regionIndex}&&areaIndex=${that.data.areaIndex}&&serverIndex=${that.data.serverIndex}`})
  }
})