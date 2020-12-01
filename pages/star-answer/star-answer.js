// pages/login/login.js
const app = getApp()
const { common,base64 } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   totalList: [],
   defaultPageSize: app.getPageSize(),

   searchText:"",
   searchTextList:[],

   userInfo :{},
   answerList:[],
   isFirstIn: true,
   isSearchIn:false,

   hasSearchContent:false,
   showConfirmLogin:false,
   showConfirmAuthorization:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.lmFramework = that.selectComponent("#lm-framework");
    that.setData({
      userInfo: app.getUser()
    })
  },

  // http://www.dazuiba.cloud:8001/api/_search/defaultSearch/a_game_setting?filter={"PARENT_ID":null}


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    var that = this;
    // that.loadAnswer()
  },
  // 管理员编辑；；普通用户编辑；；；管理员查看投稿
  //查询首页显示及过滤
  callBackPageSetData: function (e) {
    var that = this;
    that.setData(e.detail.returnSetObj)
  },
  loadMainList: function (e) {
    var { pageNo, pageSize, type } = e.detail;
    var that = this;
    var data = that.data;
    var  filter = [
      {
        "fieldName": "SUBJECT,TRUE_ANSWER,FALSE_ANSWER",
        "type": "string",
        "compared": "like",
        "filterValue": data.searchText
      },{
        "fieldName": "STATUS",
        "type": "date",
        "compared": "=",
        "filterValue": '已启用'
      }]
    var p = {
      "tableName": "B_STAR_ANSWER",
      "page": pageNo,
      "limit": pageSize,
      "filters": filter
    }
    if(that.data.searchText != ''){
      app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
        if (dataList != 'error') {
          if(dataList.length == 0){
            // <!-- 普通人和管理员进入，进行查询，没有查到结果 -->
            that.setData({
              hasSearchContent: false,
              isSearchIn:true,
              isFirstIn:false
            }) 
          }else if(dataList.length>0){
            // <!-- 普通人和管理员进入，进行查询查到结果，展示查询结果关键字标绿色，展示广告位。循环展示内容 -->
            dataList.forEach(item=>{
               item.SUBJECT = that.trim(item.SUBJECT).split('');
               item.TRUE_ANSWER = that.trim(item.TRUE_ANSWER).split('');
               item.FALSE_ANSWER = that.trim(item.FALSE_ANSWER).split('');
            })
            that.lmFramework.dealWithList(type, dataList, pageSize);
            that.setData({
              // answerList: dataList,
              hasSearchContent:true,
              isFirstIn:false,
              isSearchIn:true
            })
            var searchValue = that.trim(that.data.searchText);
            that.setData({
              searchTextList : searchValue.split('')
            })
          }
        }
      })
    }else{
      that.setData({
        answerList: [],
        hasSearchContent: false,
        isFirstIn: false,
        isSearchIn: true
      })
    }
  },
  loadAnswer:function(){
    var that = this;
   
    var  filter = [
      {
        "fieldName": "SUBJECT,TRUE_ANSWER,FALSE_ANSWER",
        "type": "string",
        "compared": "like",
        "filterValue": that.data.searchText
      },{
        "fieldName": "STATUS",
        "type": "date",
        "compared": "=",
        "filterValue": '已启用'
      }]
    var p = {
      "tableName": "B_STAR_ANSWER",
      "page": 1,
      "limit": 10000,
      "filters": filter
    }
    if(that.data.searchText != ''){
      app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
        if (dataList != 'error') {
          if(dataList.length == 0){
            // <!-- 普通人和管理员进入，进行查询，没有查到结果 -->
            that.setData({
              hasSearchContent: false,
              isSearchIn:true,
              isFirstIn:false
            }) 
          }else if(dataList.length>0){
            // <!-- 普通人和管理员进入，进行查询查到结果，展示查询结果关键字标绿色，展示广告位。循环展示内容 -->
            dataList.forEach(item=>{
               item.SUBJECT = that.trim(item.SUBJECT).split('');
               item.TRUE_ANSWER = that.trim(item.TRUE_ANSWER).split('');
               item.FALSE_ANSWER = that.trim(item.FALSE_ANSWER).split('');
            })
            that.setData({
              answerList: dataList,
              hasSearchContent:true,
              isFirstIn:false,
              isSearchIn:true
            })
            var searchValue = that.trim(that.data.searchText);
            that.setData({
              searchTextList : searchValue.split('')
            })
          }
        }
      })
    }else{
      that.setData({
        answerList: [],
        hasSearchContent: false,
        isFirstIn: false,
        isSearchIn: true
      })
    }
    
  },
  searchList: function ({
    detail
  }) {
    var that = this;
    that.setData({
      searchText: detail
    })
    if(detail ==''){
      that.setData({
        isFirstIn:true,
        isSearchIn:false
      })
    }else{
      // that.loadAnswer() 
      that.lmFramework.dealPageNoSize('enter')
    }
    
  },
   // 去除首尾的空格
  trim: function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },
  //管理员补充题库
  managerEditBank:function(){
    var that  = this;
    wx.navigateTo({
      url: 'edit-manager-detail',
    })
  },
  commonEditBank:function(){
    var that  = this;
    //校验是否是已经登录注册人员
    var that = this;
    var userInfo = that.data.userInfo;
    if(userInfo == undefined || userInfo == null  || userInfo == ''){
      that.setData({showConfirmLogin:true})
    }else{
      wx.navigateTo({
        url: 'edit-common-detail',
      })
    }
  },
  //第一次授权
  getPhoneNumber:async function(res) {
    var that = this;
    if (res.detail.errMsg == 'getPhoneNumber:ok') {
      //用户按了允许授权按钮
      
      var data = res.detail;
      var encryptedData = data.encryptedData;
      var iv = data.iv;
      var code = await app.getJsCode();
      var p = {
        "jsCode": code,
        "name": base64.encode(that.data.userInfo.name),
        "url": that.data.userInfo.url,
        "encryptedData": encryptedData,
        "iv": iv,
      }
      await app.ManageExecuteApi(`/api/_login/doLogin`, '', p, "POST").then((userInfo) => {
        if(userInfo != 'error'){//存入user  跳转页面
          var data = userInfo[0];
          var info = {
            id: data.KID,
            code: data.CODE,
            name: data.NAME,
            url: data.IMG_URL,
            isManager: data.IS_SA,
            tel: data.PHONE,
            isPermanent: data.IS_PERMANENT,
            countNumber: data.COUNT_NUMBER,
          };
          app.setUser(info)
          that.setData({
            userInfo: info,
            showConfirmAuthorization:false
          })
          wx.showToast({
            title: '注册成功',
            icon:'none',
            duration:1500
          })
        }else{
          //重新授权登录
          that.setData({
              showConfirmAuthorization:false
          })
          wx.showToast({
            title: '注册失败',
            icon:'none',
            duration:1500
          })
        }
      })
    } else {
      wx.showToast({
        title: '注册解锁更多功能哦~',
        icon:'none',
        duration:1500
      })
    }
 },
  getUserInfo: async function(res){
    var that = this;
    if (res.detail.errMsg == 'getUserInfo:ok') {
        //用户按了允许授权按钮
        var data = JSON.parse(res.detail.rawData);
        var nickName = data.nickName;
        var name = nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "") ;
        var userInfo = {
          name: name,
          url: data.avatarUrl
        }
        that.setData({
          userInfo:userInfo,
          showConfirmLogin:false,
          showConfirmAuthorization:true
        })
      } else {
        //用户按了拒绝按钮
        that.setData({
          showConfirmLogin:false,
        })
      }
  },
  //查看投稿
  selBank:function(){
    var that = this;
    wx.navigateTo({
      url: 'examine-common-submittion',
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "分享星运答题", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/star-answer/star-answer`, // 默认是当前页面，必须是以‘/’开头的完整路径
      // imageUrl: tempath,
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: "分享成功~"
          })
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () { }
    }
    return shareObj;
  },
})