// pages/order/order-slider.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalList: [[{
      KID:1,
      NAME:'一站到底'
    }],[{
      KID:2,
      NAME:'一到底'
    }]],
    defaultPageSize: app.getPageSize(),

    sliderList: [],
    currentSliderbar: 0,
    searchText: '',

    hasPicker:false,
    currentSliderbarChangeId: "",
    isPicker:false
  },

  onLoad: function(options) {
    var that = this;
    console.log(options)
    if (options.areaId != undefined) {
      that.setData({
        currentSliderbarChangeId: options.areaId,
      })
    }
    that.sjFramework = that.selectComponent("#lm-framework");
    
  },
  onShow:function(){
    var that = this;
    that.loadSliderList();
  },
  callBackPageSetData: function(e) {
    // var that = this;
    // wx.hideLoading();
    // that.setData(e.detail.returnSetObj)
  },

  //获取产品列表
  loadMainList: async function(e) {
    // var {
    //   pageNo,
    //   pageSize,
    //   type
    // } = e.detail;
    // var that = this;
    // var p = {
    //   category_id: that.data.currentSliderbar,
    //   s_t: that.data.searchText,
    //   // cid: app.getUser().cid,
    //   // user_id: app.getUser().id, //有一列是收藏
    //   // page_size: pageSize,
    //   // page_no: pageNo,
    // }
    // //获取当前选中客户的产品报价
    // // var list = await app.ExecuteProcess('sel_customer_product_information_sjn', p);
    // that.sjFramework.dealWithList(type, dataList, pageSize);
  },
  
  loadSliderList: async function() {
    var that = this;
    var sliderList = [{
      KID: 0,
      IS_ENABLE: true,
      NAME: "全部"
    },{
      KID: -2,
      IS_ENABLE: true,
      NAME: "促销"
    },{
      KID: -1,
      IS_ENABLE: true,
      NAME: "收藏"
    }];

    that.setData({
      sliderList: sliderList,
    })

    //获取slider列表
    
    // var p = {
    //   store_code: that.getStore().CODE,
    //   cid: that.getUser().cid,
    // }
    // //获取当前选中客户的产品类别
    // that.ExecuteProcess('sel_customer_product_category_sjn', p).then((slider) => {

    //   that.setSliderList(slider);
     
    // })
    
   
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
    that.sjFramework.dealPageNoSize('enter');
  },
  
})