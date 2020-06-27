const app = getApp()
// pages/myPublish/myPublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    myPublishList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.loadMyPublishList();
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
  bindStatusCboChange: function (e) {
    var that = this;
    var select = that.data.comboboxStatusList[e.detail.value].KID;
    that.setData({
      selectStatus: e.detail.value
    })
    that.loadMyPublishList()
  },

  loadMyPublishList: function () {
    var that = this;
    var p = {};
    if (that.selectStatus = "全部") {
      p = {
        "SELL_USER_ID": "1"
      }
    } else {
      p = {
        "SELL_USER_ID": "1",
        "STATUS": that.selectStatus,
      }
    }
    var url = `/api/_search/defaultSearch/b_product_list?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((result) => {
      if (result != 'error') {
        var data = result;
        that.setData({
          myPublishList: result,
        })
      }
    })
  }


})