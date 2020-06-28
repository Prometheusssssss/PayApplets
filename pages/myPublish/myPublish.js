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
    myPublishList: [],

    areaIndex: 0,
    regionIndex: 0,
    serverIndex:0,
    areaList: [],
    regionList: [],
    serverList:[],
    areaId:'',
    regionId:'',
    serverId:'',
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
    that.loadArea()
  },
  loadArea:function(){
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
  editPubilshProduct:function(e){
    var that = this;
    var data = that.data;
    var publishInfo = e.target.dataset.item;
    var areaId = publishInfo.GAME_PARTITION_KID;//大区
    var areaIndex = data.areaList.findIndex((area)=>area.KID == areaId);
    var regionId =  publishInfo.GAME_SECONDARY_KID;//二级区
    var serverId =  publishInfo.GAME_ZONE_KID;//服务器
    var areaInfo = {
      type:'edit',
      regionId:regionId,
      areaId:areaId,
      serverId:serverId,
      areaIndex:areaIndex,
      publishInfo:publishInfo
    }
    app.setArea(areaInfo);
    wx.switchTab({
      url: `../publish/publish`
    })
   
  }
})