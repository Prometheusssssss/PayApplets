// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate:'',
    endDate:'',
    defaultPageSize:10,
    showProductItemDetail: false,
    Length:6,    //输入框个数 
    isFocus:true,  //聚焦 
    Value:"",    //输入的内容 
    ispassword:false, //是否密文显示 true为密文， false为明文。 
    id:'',                        //上传时后端返回的图片ID,拼接后存入
    joinString:'',                    
    uploaderList: [],              //保存上传图片url的数组
    uploaderNum: 0,             //已经上传的图片数目
    showUpload: true,           //控制上传框的显隐
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
})