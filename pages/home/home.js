// pages/home/home.js
const app = getApp()
const { common,base64 } = global;
var isonShow;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enhancementsList1:[{
      URL:'../../assets/img/area/commond.png',
      IDENTITY:'',
      NAME:'琅玟推荐',
      TYPE:'lwtuijian',
      TIP_URL:''
    },{
      URL:'../../assets/img/area/calculate.png',
      IDENTITY:'',
      NAME:'琅玟计算',
      TYPE:'lwjisuan',
      TIP_URL:''
    }],
    enhancementsList2:[{
      URL:'../../assets/img/area/simulation.png',
      IDENTITY:'',
      NAME:'琅玟模拟',
      TYPE:'lwmoni',
      TIP_URL:''
    },{
      URL:'../../assets/img/area/think-caculate.png',
      IDENTITY:'',
      NAME:'琢磨计算',
      TYPE:'think-caculate',
      TIP_URL:'../../assets/img/area/look-forward.png'
    }],
    strategyList1:[{
      URL:'../../assets/img/area/zhihe.png',
      IDENTITY:'',
      NAME:'奇遇',
      TYPE:'qiyu',
      TIP_URL:''
    },{
      URL:'../../assets/img/area/search.png',
      IDENTITY:'身份:',
      NAME:'捕快断案',
      TYPE:'bukuai',
      TIP_URL:''
    }
  ],
    strategyList2:[{
      URL:'../../assets/img/area/cook.png',
      IDENTITY:'',
      NAME:'厨师菜谱',
      TYPE:'cook',
      TIP_URL:''
    }, {
      URL:'../../assets/img/area/caipu-cost.png',
      IDENTITY:'',
      NAME:'菜谱成本',
      TYPE:'caipu-cost',
      TIP_URL:'../../assets/img/area/new.png'
    }
  ],
    strategyList3:[
      {
        URL:'../../assets/img/area/fish.png',
        IDENTITY:'',
        NAME:'食材鱼王',
        TYPE:'fish',
        TIP_URL:''
      }, 
      {
        URL:'../../assets/img/area/love.png',
        IDENTITY:'',
        NAME:'伙伴好友度',
        TYPE:'haoyou',
        TIP_URL:''
    }],
    strategyList4:[
    {
      URL:'../../assets/img/area/xingqiu.png',
      IDENTITY:'',
      NAME:'星运答题',
      TYPE:'xingqiu',
      TIP_URL:''
    },
    {
      URL:'../../assets/img/area/collect.png',
      IDENTITY:'',
      NAME:'星运计算',
      TYPE:'jisuan',
      TIP_URL:''
    }],
    strategyList5:[{
      URL:'../../assets/img/area/lightning.png',
      IDENTITY:'',
      NAME:'逆天改命',
      TYPE:'nitiangaiming',
      TIP_URL:'../../assets/img/area/look-forward.png'
    }],
    caipuImageUrl:'https://oss.dazuiba.cloud:8003//api/oss/20201207-08405d4a-1376-486c-8c6e-d0b0aefc93e3/image',
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
    if (isonShow) {//添加弹框在预览图片
      isonShow= false;
      return;
    };
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
    }else if(type == 'caipu-cost'){
        //弹出弹框
        that.previewImage()
    }else if(type == 'think-caculate'){
      //弹出弹框
      wx.navigateTo({
        url: '../ponder/ponder',
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
  previewImage: function () {
    var that = this;
    isonShow = true;
    wx.previewImage({
      current: that.data.caipuImageUrl, // 当前显示图片的http链接
      urls: [that.data.caipuImageUrl]// 需要预览的图片http链接列表
    })
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