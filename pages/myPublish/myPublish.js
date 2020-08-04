const app = getApp()
const {
  common
} = global;
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
        NAME: '已卖出'
      }, {
        NAME: '已下架'
      },
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

    activeSliderId: -1,//侧边栏当前活动id
    showConfirmDelete: false,
    showConfirmOff: false,
    showConfirmreducce: false,
    currentProductInfo: {},
    currentProductKid:'',
    newPrice:0,
    buttonArray: [{
      'title': '删除',
      'triggerEvent': 'DeleteEvent',
      'width': 140,
      'color': 'var(--text-red)'
    },
    {
      'title': '编辑',
      'triggerEvent': 'EditEvent',
      'width': 140,
      'color': 'var(--main-style)'
    }],

    showButton:false,
    offList:['下架','删除'],
    onList:['上架','删除'],
    newStatus:'',
    publishStatus:'上架',
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
    var id = app.getUser().id    
    var filter = [];
    //我发布的 是作为卖家存在
    if(data.selectStatus == '全部'){
      filter=[{
          "fieldName":"NAME",
          "type":"string",
          "compared":"like",
          "filterValue": data.searchText
        },
        {//卖家id
          "fieldName":"SELL_USER_ID",
          "type":"date",
          "compared":"=",
          "filterValue": id
        }]
    }else{
      var status = data.selectStatus;
      filter=[{
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
          "filterValue": id
        }]
    }
    var p = {
      "tableName":"b_product_list",
      "page": pageNo,
      "limit": pageSize,
      "filters": filter,
      "orderByField":"SHELF_TIME",
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
  bindStatusCboChange: function (e) {
    var that = this;
    that.setData({
      selectStatus: that.data.comboboxStatusList[e.detail.value].NAME
    })
    that.lmFramework.dealPageNoSize('enter');
  },
  //编辑
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
    // app.setArea(areaInfo);
    wx.navigateTo({
      url: `../publish/publish-edit?areaInfo=${JSON.stringify(areaInfo)}`
    })
  },
  showView: function (detail) {
    var that = this;
    var item = detail.currentTarget.dataset.obj;
    var index = detail.currentTarget.dataset.index;
    let currentProductInfo = item;
    let price = currentProductInfo.PRICE;
    let num = Number(price);
 
    that.setData({
      showNumMaskLayer: true,
      currentProductInfo: currentProductInfo,
      showNum: num,
      productIndex: index,
      firstIn: true,
    })
  },
  reducePubilshProductPrice: function(e){//做个简单的框框 参考咸鱼
    var that = this;
    var product = e.target.dataset.item;
    var productKid = product.KID;
    that.setData({
      showConfirmreducce:true,
      currentProductKid: productKid,
      currentProductInfo:product,
      newPrice:product.PRICE-1,
      firstIn: true,
    })
  },
  //计算器开始
  commitPrice: async function () {
    var that = this;
    var newPrice = that.data.newPrice;
    var oldPrice = that.data.currentProductInfo.PRICE;
    
    if (common.validators.isInValidNum(newPrice, '价格') ) {
      return;
    }
    if(newPrice>= oldPrice){
      wx.showToast({
        title: '新的价格不能高于原价',
        icon:'none',
        duration:1000
      })
      return
    }
    //降价更新价格 
    var p = {
      KID: that.data.currentProductKid,
      PRICE: newPrice,
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_product_list', '', p, 'POST').then((result) => {
      if (result != 'error') {
        this.setData({
          showConfirmreducce:false
        })
        wx.showToast({
          title: '降价成功',
          icon: 'none',
          duration: 1500
        })
        that.lmFramework.dealPageNoSize('enter');
      }
    })
  },

  setPrice: function (e) {
    var that = this;
    var firstIn = that.data.firstIn;
    var newPrice = that.data.newPrice
    var num = e.currentTarget.dataset.inputText;
    if (firstIn == true) {
      that.setData({
        ["newPrice"]: num,
        firstIn: false,
      })
    } else {
      if (newPrice == '0' && num != '.') {
        that.setData({
          ["newPrice"]: num,
        })
      } else {
        that.setData({
          ["newPrice"]: newPrice + '' + num
        })
      }
    }
  },
  deletePrice: function (e) {
    var that = this;
    var num = that.data.newPrice;
    if (num.toString().length > 0) {
      that.setData({
        ["newPrice"]: num.toString().substring(0, num.toString().length - 1)
      })
    }
  },

  clearPrice: function () {
    var that = this;
    var num = 0;
    that.setData({
      ["newPrice"]: num
    })
  },

  cancel: function () {
    var that = this;
    that.setData({ showConfirmreducce: false })

  },//计算器结束\


  //点击点点点 显示更多
  actionsheet: function(e){
    var that = this;
    var productInfo = e.target.dataset.item;
    that.setData({currentProductKid : productInfo.KID})
    var status = productInfo.STATUS;
    var sheetList = [];
    if(status =='上架中'){
      sheetList = that.data.offList
    }else  if(status =='已下架'){
      sheetList = that.data.onList
    }
    wx.showActionSheet({
      itemList: sheetList,
      // itemColor :'#2583F5',
      success(e) {
       if(e.errMsg == 'showActionSheet:ok' ){
        console.log(e.tapIndex)
          var index = e.tapIndex;
          if(index == 0){//下架 更新发布商品状态
            var status = '上架中';
            if(sheetList[0] == '上架'){
              status = '上架中'
              that.setData({
                newStatus : status,
                publishStatus: sheetList[0]
              })
              var p = {
                KID: productInfo.KID,
                STATUS: status,
              }
              app.ManageExecuteApi('/api/_cud/createAndUpdate/b_product_list', '', p, 'POST').then((result) => {
                if (result != 'error') {
                  //更新商品发布状态
                  wx.showToast({
                    title: sheetList[0]+'成功',
                    icon: 'none',
                    duration: 1500
                  })
                  that.lmFramework.dealPageNoSize('enter');
                }
              })

            }else if(sheetList[0] == '下架'){
              status = '已下架'
              that.setData({
                newStatus : status,
                showConfirmOff :true,
                publishStatus: sheetList[0]
              })
            }
           
            
           
          }else if(index == 1){//删除 kid 表名
            that.deleteProductItem(productInfo)
          }
       }
      },
      fail(e) {
      },
    })
  },
  
  //删除 
  deleteProductItem:function(product){
    var that = this;
    that.setData({
      currentProductInfo : product,
      showConfirmDelete: true,
    })
   
   
  },
  //上架中的删除，给确认提示，然后确认删除，确认删除之前先刷一下产品状态，已售卖不能删除 ；；一下架的可以删除
  confirmDelete: function (e) {
    var that = this;
    var currentProductInfo = that.data.currentProductInfo;
    //先查询一下产品的最新状态
    //接入删除接口 
    var p ={
      KID: currentProductInfo.KID
    }
    app.ManageExecuteApi('/api/_cud/del/b_product_list', '', p, 'POST').then((result) => {
      if (result != 'error') {
        wx.showToast({
          title: '删除成功',
          duration:1000,
          icon:'none'
        })
        that.setData({
          showConfirmDelete: false,
        })
        that.lmFramework.dealPageNoSize('enter')
      }
    })
  },
  confirmOff: function () {
    var that = this;
    var kid = that.data.currentProductKid;
    //接入下架接口 
    //更新状态
    var p = {
      KID: kid,
      STATUS: that.data.newStatus,
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_product_list', '', p, 'POST').then((result) => {
      if (result != 'error') {
        //更新商品发布状态
        wx.showToast({
          title: that.data.publishStatus+'成功',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          showConfirmOff: false,
        })
        that.lmFramework.dealPageNoSize('enter');
      }
    })
   
  },
})