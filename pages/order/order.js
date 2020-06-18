// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   searchText:'',
   pickerIndex:0,
   pickerList:[{
    KID:0,
    NAME:'天游区'},{
    KID:1,
    NAME:'滴游区'}
   ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.sjFramework = that.selectComponent("#lm-framework");
    that.sjFramework.dealPageNoSize('enter')
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
  }
})