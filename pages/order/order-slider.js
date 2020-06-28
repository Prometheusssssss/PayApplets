// pages/order/order-slider.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalList: [],
    defaultPageSize: app.getPageSize(),

    sliderList: [],
    currentSliderbar: 0,
    searchText: '',

    hasPicker:false,
    currentSliderbarChangeId: "",
    areaId:'',
    regionId:'',
    serverId:'',
    areaIndex:'',
    regionIndex:'',
    serverIndex:'',
    isPicker:false
  },

  onLoad: function(options) {
    var that = this;
    console.log(options)
    if (options != undefined) {
      that.setData({
        currentSliderbar:options.regionId,
        currentSliderbarChangeId: options.regionId,
        areaId :options.areaId,
        serverId:options.serverId,
        areaIndex: options.areaIndex,
        regionIndex: options.regionIndex,
        serverIndex: options.serverIndex,
      })
    }
  },
  onShow:function(){
    var that = this;
    that.loadSliderList();
  },
  // callBackPageSetData: function(e) {
  //   var that = this;
  //   wx.hideLoading();
  //   that.setData(e.detail.returnSetObj)
  // },

  //获取产品列表
  // loadMainList: async function(e) {
  //   var {
  //     pageNo,
  //     pageSize,
  //     type
  //   } = e.detail;
  //   var that = this;
  //   var p = {"PARENT_ID": that.data.regionId}
  //   var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
  //   console.log(url)
  //   app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
  //     if (dataList != 'error') {
  //       that.sjFramework.dealWithList(type, dataList, pageSize);
  //     }
  //   })
    
  // },
  loadServer: async function() {
    var that = this;
    var p = {"PARENT_ID": that.data.currentSliderbar}
    var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
    console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
      wx.hideLoading()
      if (dataList != 'error') {
        that.setData({totalList:dataList})
      }
    })
    
  },
  loadSliderList: async function() {
    var that = this;
    //获取slider列表

    var p = {"PARENT_ID": that.data.areaId}
    var url = `/api/_search/defaultSearch/a_game_setting?filter=${JSON.stringify(p)}`;
    console.log(url)
    app.ManageExecuteApi(url, '', {}, 'GET').then((slider) => {
      if (slider != 'error') {
        that.setSliderList(slider);
      }
    })
  },
   //获取初始化侧边栏
   setSliderList: function(slider) {
    var that = this;
    var sliderList = slider;
    that.setData({
      sliderList: sliderList,
    })

    if (that.data.currentSliderbarChangeId != "") {
      var slider = null;
      sliderList.forEach(sliderItem => {
        if (sliderItem.KID.toString() == that.data.currentSliderbarChangeId.toString()) {
          slider = sliderItem;
        }
      })
      if (slider == null) {
        if (that.data.currentSliderbarChangeId != 0) {
          setTimeout(() => {
            wx.showToast({
              title: '暂无此类别',
              duration: 1500,
              icon: 'none'
            });
            that.setData({
              currentSliderbarChangeId: '',
            })
          }, 1000)
        }

      } else {
        that.setData({
          currentSliderbarChangeId: '',
          currentSliderbar: slider.KID,
        })
      }

    }
    //加载产品列表
    that.loadServer();
    // that.sjFramework.dealPageNoSize('enter');
  },

  changeSliderBar: function({
    detail
  }) {
    var that = this;
    var regionIndex = that.data.sliderList.findIndex(region=>region.KID == detail.KID);
    that.setData({
      currentSliderbar: detail.KID,
      regionIndex: regionIndex,
    })
    that.loadServer()
  },

  selecServer: function(e){
    var that = this;
    var serverData =e.currentTarget.dataset.item;
    that.setData({
      serverId:serverData.KID
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var serverIndex = that.data.totalList.findIndex(server=>server.KID == serverData.KID);
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      areaIndex: that.data.areaIndex,//大区
      regionIndex: that.data.regionIndex,//小区
      serverIndex: serverIndex,//小区
      areaId : that.data.areaId,
      regionId: that.data.currentSliderbar,
      serverId: serverData.KID,
    })
    wx.navigateBack({
      delta: 1
    })
  }
  
})