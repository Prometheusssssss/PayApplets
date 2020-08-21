// pages/login/login.js
const app = getApp()
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

    imageUrl:'',
    tmpPath:'',
    isPic : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if(month.toString().length<2){
      month = '0' + month
    }
    if(day.toString().length<2){
      day = '0' + day
    }
    var newDate = year+'-'+month+'-'+day;
    that.setData({
      startDate: newDate,
      endDate: newDate
    })
  },

  focus(e){ 
    var that = this; 
    console.log(e.detail.value); 
    var inputValue = e.detail.value; 
    that.setData({ 
     Value:inputValue, 
    }) 
   }, 
   tap(){ 
    var that = this; 
    that.setData({ 
     isFocus:true, 
    }) 
   }, 
   formSubmit(e){ 
    console.log(e.detail.value.password); 
   }, 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    var that = this;
    that.sjFramework = that.selectComponent("#lm-framework");
    that.sjFramework.dealPageNoSize('enter')
    await that.getImageUrl()
    // that.createCanvas()
  },
  getImageUrl:function(){
    var that = this;
    //网上路径转成本地路径
    wx.getImageInfo({
      src: 'https://img3.doubanio.com/view/photo/l/public/p2327709524.jpg',
      success: function (res) {
        console.log(res.width)
        console.log(res.path)
        that.setData({imageUrl:res.path})
      }
    })
  },
  createCanvas:function(){
    var that = this;
    let ctx = wx.createCanvasContext('share_canvas', this);
    
    ctx.drawImage(that.data.imageUrl, 0, 0, 300, 400);
    ctx.draw(true,setTimeout(function(){
        wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            success: function(res){
                // that.data.tmpPath = res.tempFilePath
                console.log('res.tempFilePath')
                console.log(res.tempFilePath)
                that.setData({tmpPath : res.tempFilePath})
            },
        })
    },1000));
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


  startDatePickerBindchange:function(e){
    var that = this;
    
    that.setData({
      startDate:e.detail.value
    })
    console.log(that.data.startDate)
  },
  endDatePickerBindchange:function(e){
    var that = this;
    that.setData({
      endDate:e.detail.value
    })
  },
  searchDate: function(){
    
    var that = this;
    console.log(that.data.startDate)
    // var startDate = that.data.startDate;
    // var endDate = that.data.endDate;
   
  },
  upload: function(){
    var that = this;
    //选择图片
    wx.chooseImage({//调起选择图片
      count: 6 - that.data.uploaderNum, // 默认6
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.data.uploaderList.concat(res.tempFilePaths);
        var uploaderList = res.tempFilePaths;
        that.setData({
          uploaderList: that.data.uploaderList.concat(res.tempFilePaths),
        })
        that.setData({
          uploaderNum: that.data.uploaderList.length
        })
        if (uploaderList.length == 6) {
          that.setData({
            showUpload:false
          })
          console.log(that.showUpload)
        }
        //图片选择完就可以显示在本地，可以提交的时候再去存入oss，换入可直接访问的图片链接，存入数据库
        //将压缩或者不压缩图片本地连接上传给oss，oss返回带域名可以直接访问的图片链接，本地将图片链接逗号拼接，保存的时候存入数据库
        // for (var i = 0; i < uploaderList.length; i++) {
        //   wx.uploadFile({
        //     url: 'xxxxx',
        //     filePath: uploaderList[i],
        //     name: 'files',
        //     formData: {
        //       files: uploaderList,
        //     },
        //     success: function (res) {
        //        var id = JSON.parse(res.data).data.attId
        //         that.setData({
        //         id: that.data.id + `${id},`,
        //         joinString: (that.data.id + `${id},`).slice(0, -1)
        //       })
        //     }
        //   })
        // }
      }
    })
  },
  //展示图片
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
 // 删除图片
  clearImg: function (e) {
    var that = this
    var nowList = [];//新数据
    var uploaderList = that.data.uploaderList;//原数据
    
    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        var arr = that.data.joinString.split(',')
            arr.splice(i, 1);                              //删除图片的同时删除掉其对应的ID
            var newArr = arr.join(',')
            that.setData({
              joinString:newArr,
              id:newArr+','
            })
           } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true,
    })
   },
})