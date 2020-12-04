// pages/home/home.js
const app = getApp()
const { common,base64 } = global;
var isonShow;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    strategyList1:[{
      URL:'../../assets/img/area/zhihe.png',
      IDENTITY:'',
      NAME:'奇遇',
      TYPE:'qiyu'
    },{
        URL:'../../assets/img/area/love.png',
        IDENTITY:'',
        NAME:'伙伴好友度',
        TYPE:'haoyou'
      }],
    strategyList2:[{
      URL:'../../assets/img/area/search.png',
      IDENTITY:'身份:',
      NAME:'捕快断案',
      TYPE:'bukuai'
    },
    {
      URL:'../../assets/img/area/collect.png',
      IDENTITY:'',
      NAME:'星运计算',
      TYPE:'jisuan'
    }],
    strategyList3:[{
      URL:'../../assets/img/area/xingqiu.png',
      IDENTITY:'',
      NAME:'星运答题',
      TYPE:'xingqiu'
    },
    {
      URL:'../../assets/img/area/calculate.png',
      IDENTITY:'',
      NAME:'琅玟计算',
      TYPE:'lwjisuan'
    }
  ],
    strategyList4:[{
      URL:'../../assets/img/area/commond.png',
      IDENTITY:'',
      NAME:'琅玟推荐',
      TYPE:'lwtuijian'
    },
    {
      URL:'../../assets/img/area/simulation.png',
      IDENTITY:'',
      NAME:'琅玟模拟',
      TYPE:'lwmoni'
    }],
    strategyList5:[{
      URL:'../../assets/img/area/cook.png',
      IDENTITY:'',
      NAME:'厨师菜谱',
      TYPE:'cook'
    },
    {
      URL:'../../assets/img/area/fish.png',
      IDENTITY:'',
      NAME:'食材鱼王',
      TYPE:'fish'
    }],
    // imageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20200830-4d9d4613-fc94-4a8a-9531-3c0f81cdd7db/image',
    imageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20201016-a8035ddb-f0f9-4417-a772-27f7b30559d2/image',
    // zanImageUrl: 'https://oss.dazuiba.cloud:8003//api/oss/20201014-57dd94e0-3c87-4b14-96bd-c6340c4dfe9d/image',
    zanImageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20201016-bc73298c-340c-4dfe-90b1-74f360a63266/image',

  },
  //星运计算广告上移 ；； 拓扑图右边，点击放大图；；赞赏图；；；点击激励广告；；；
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
  },
 
  goStrategyPage:function(e){
    var that = this;
    var item = e.currentTarget.dataset.item;
    var type = item.TYPE;
    if(type == 'qiyu'){
      wx.navigateTo({
        url: '../adventure/adventure',
      })
    }
    else if(type == 'haoyou'){
      wx.navigateTo({
        url: '../favorability/favorability',
      })
    }
    else if(type == 'bukuai'){
      wx.navigateTo({
        url: '../lawsuit/lawsuit',
      })
    }else if(type == 'jisuan'){
      wx.navigateTo({
        url: '../star-luck/star-luck',
      })
    }else if(type == 'xingqiu'){
      wx.navigateTo({
        url: '../star-answer/star-answer',
      })
    }else if(type == 'lwjisuan'){
      wx.navigateTo({
        url: '../langwen-calculate/langwen-calculate',
      })
    }
    else if(type == 'lwtuijian'){
      wx.navigateTo({
        url: '../langwen-recommend/langwen-recommend',
      })
    } else if(type == 'cook'){
      wx.navigateTo({
        url: '../cook-book/cook-book',
      })
    } else if(type == 'fish'){
      wx.navigateTo({
        url: '../fish/fish',
      })
    }
    else if(type == 'lwmoni'){
      wx.navigateTo({
        url: '../langwen-simulation/langwen-simulation',
      })
    }
    else{
      wx.showToast({
        title: '开发中敬请期待',
        icon:'none',
        duration: 1000
      })
    }
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "分享攻略", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/home/home`, // 默认是当前页面，必须是以‘/’开头的完整路径
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