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
    currentSliderbar: 1,
    searchText: '',

    hasPicker:false,
    currentSliderbarChangeId: "",
    areaId:'',
    regionId:'',
    serverId:'',
    areaIndex:'',
    regionIndex:'',
    serverIndex:'',
    isPicker:false,
    // '天命风流','江湖轶事','闲情偶遇','侠影迷踪','大宋锦鲤'
    adventureGroupList:[{
      KID:1,
      NAME:'天命风流',
      PARENT_ID:0,
    },{
      KID:2,
      NAME:'江湖轶事',
      PARENT_ID:0,
    },{
      KID:3,
      NAME:'闲情偶遇',
      PARENT_ID:0,
    },{
      KID:4,
      NAME:'侠影迷踪',
      PARENT_ID:0,
    },{
      KID:5,
      NAME:'大宋锦鲤',
      PARENT_ID:0,
    }],
    groupName: '天命风流',

    userInfo :{},
    scrollTop:0,
  },

  onLoad: function(options) {
    var that = this;
    that.lmFramework = that.selectComponent("#lm-framework");
    that.setData({
      userInfo: app.getUser()
    })
  },
  onShow:function(){
    var that = this;
    that.lmFramework.dealPageNoSize('enter');
    // that.loadSliderList();
  },

  callBackPageSetData: function(e) {
    var that = this;
    wx.hideLoading();
    that.setData(e.detail.returnSetObj)
  },

  //获取产品列表
  loadMainList: async function(e) {
    var {
      pageNo,
      pageSize,
      type
    } = e.detail;
    var that = this;
    // filter = [
    // {
    //     "fieldName": "GROUP",
    //     "type": "date",
    //     "compared": "=",
    //     "filterValue": that.data.groupName
    //   }
    // ]
    // var p = {
    //   "tableName": "B_ADVENTURE_STRATEGY",
    //   "page": pageNo,
    //   "limit": pageSize,
    //   "filters": filter,
    //   "orderByField": "NAME",
    //   "isDesc":1
    // }
   
    // app.ManageExecuteApi('/api/_search/postSearch', '', p, 'POST').then((dataList) => {
    //   if (dataList != 'error') {
    //     that.lmFramework.dealWithList(type, dataList, pageSize);
    //   }
    // })
    var dataList = [{
      KID:1,
      GROUP:'天命风流',
      NAME:'八荒之焰.之一',
      IS_ENABLE:true,
      CLUE:'八荒之焰.之一第一天自动签到，自动激活',//线索
      OPENING_CONDITIONS:'开启第一天签到',//开启条件
      COORDINATE:'洛阳555,555',//坐标
      ENDING:'结局成功激活',//结局,
      CONTRIBUTOR:'李梦',
    },{
      KID:2,
      GROUP:'天命风流',
      NAME:'八荒之焰.之二',
      IS_ENABLE:true,
      CLUE:'八荒之焰.之二打野获取金币',//线索
      OPENING_CONDITIONS:'打野',//开启条件
      COORDINATE:'洛阳535,551',//坐标
      ENDING:'',//结局
      CONTRIBUTOR:'李k',
    },
    {
      KID:3,
      GROUP:'天命风流',
      NAME:'八荒之焰.之三',
      IS_ENABLE:false,
      CLUE:'八荒之焰.之三开启第一天打怪',//线索
      OPENING_CONDITIONS:'开启第一天打怪',//开启条件
      COORDINATE:'天津555,555',//坐标
      ENDING:'',//结局,
      CONTRIBUTOR:'lm',
    },{
      KID:4,
      GROUP:'天命风流',
      NAME:'八荒之焰.之四',
      IS_ENABLE:false,
      CLUE:'',//线索
      OPENING_CONDITIONS:'',//开启条件
      COORDINATE:'',//坐标
      ENDING:'',//结局
      CONTRIBUTOR:'',
    },
    {
      KID:1,
      GROUP:'江湖轶事',
      NAME:'江湖轶事.之一',
      IS_ENABLE:false,
      CLUE:'江湖轶事树林打石头怪升级',//线索
      OPENING_CONDITIONS:'打怪',//开启条件
      COORDINATE:'北京999,999',//坐标
      ENDING:'',//结局,
      CONTRIBUTOR:'wangbj',
    }]
   
    var adventureList = [];
    dataList.forEach(item=>{
      if(item.GROUP == that.data.groupName){
        adventureList.push(item)
      }
    })
   
    that.setData({
      sliderList: adventureList,
    })
    that.lmFramework.dealWithList(type, adventureList, pageSize);
  },

  changeSecondCategory: function (e) {
    var that = this;
    var groupName = e.currentTarget.dataset.item;
    that.setData({
      groupName: groupName
    })
    // that.lmFramework.dealPageNoSize('enter');
  },

  // 切换slider滚动到指定位置
  changeSliderBar: function({
    detail
  }) {
    var that = this;
    var id = detail.KID;
    
  //  that.setData({
  //   scrollTop: -50
  //  })
    var toViewid = "#product_"+id;//获取id
    const query=wx.createSelectorQuery();  //创建节点查询器
    query.select(toViewid).boundingClientRect()  //选择toViewid获取位置信息
   
    query.selectViewport().scrollOffset()  //获取页面查询位置的
    query.exec(function(res) {
        let scrollTop = 0;
        if(res[3]){
          scrollTop = res[0].top + res[3].scrollTop
        }else{
          scrollTop = res[0].top;
        }
        wx.pageScrollTo({
            // scrollTop: scrollTop - 160,
            duration: 300
        });
        
    })
    that.setData({
      currentSliderbar: detail.KID,
    })
  },

 
  
})