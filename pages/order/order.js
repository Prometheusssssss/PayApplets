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
  //订单处理 只有客服可以看到 不用限制状态
  loadMainList: function (e) {
    var { pageNo, pageSize, type } = e.detail;
    var that = this;
    var data = that.data;
    // var id = app.getUser().id    
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
              "filterValue": '上架中'
            },
            {
              "fieldName":"GAME_ZONE_KID",
              "type":"date",
              "compared":"=",
              "filterValue": data.serverList[data.serverIndex].KID
            },
        ],
        "orderByField":"SHELF_TIME",
        "isDesc":1
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