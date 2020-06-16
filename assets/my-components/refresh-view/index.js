// components/RefreshLayout/refresh-layout.js
let lastY = 0
const PULL_DEFAULT = -1 //默认
const PULL_LT_HEIGHT = 1 //下拉小于高度
const PULL_GT_HEIGHT = 2 //下拉大于高度
const PULL_REFRESHING = 0 //刷新中
let platform = 'ios',
  scale = 375 / wx.getSystemInfoSync().windowWidth * 2
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    backgroundColor: {
      type: String,
      value: "white"
    },
    refreshHeight: {
      type: Number,
      value: 150
    },
    textColor: {
      type: String,
      value: "#000"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pullState: PULL_DEFAULT, // 刷新状态 -1:默认  1:开始下拉  2: 达到下拉最大距离  0: 正在刷新 
    dynamicHeight: 0, //刷新布局动态高度
    refreshHeight: 150, //触发刷新的最小高度
    scrollTop: 0
  },
  /***
   * 不能使用setData
   */
  created: function () {
    platform = wx.getSystemInfoSync().platform
    scale = wx.getSystemInfoSync().windowWidth / 375 * 2
  },
  attached: function () {},
  ready: function () {},
  moved: function () {},
  detached: function () {},
  /**
   * 组件的方法列表
   */
  methods: {
    //自动刷新
    autoRefresh() {
      var that = this;
      that._pullStateChange(PULL_REFRESHING, that.data.refreshHeight)
      //刷新事件 回调出去
      that.triggerEvent("onRefresh")
    },
    //停止刷新
    stopPullRefresh() {
      var that = this;
      // that._pullStateChange(PULL_DEFAULT, 0)
      that.setData({
        pullState: PULL_DEFAULT,
        dynamicHeight: 0
      }, () => {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      })

    },
    //是否正在刷新
    isRefreshing() {
      var that = this;
      return PULL_REFRESHING == that.data.pullState
    },
    //是否下拉状态
    isPullState() {
      var that = this;
      return PULL_DEFAULT != that.data.pullState
    },
    //页面触摸开始事件，必须在触摸开始方法中调用此方法
    handletouchstart: function (event) {
      lastY = event.touches[0].clientY
    },
    //页面触摸移动事件，必须在触摸开始方法中调用此方法
    handletouchmove: function (event) {
      var that = this;
      let pageY = event.touches[0].pageY;
      // let clientY = event.touches[0].clientY;
      let offsetY = pageY - lastY;
      if (that.data.scrollTop > 0 || offsetY < 0) return;
      let dynamicHeight = that.data.dynamicHeight + offsetY;
      lastY = pageY;
        if (dynamicHeight > that.data.refreshHeight) {
          that._pullStateChange((0 == that.data.pullState) ? 0 : PULL_GT_HEIGHT, dynamicHeight)
        } else {
          dynamicHeight = dynamicHeight < 0 ? 0 : dynamicHeight //如果动态高度小于0处理
          that._pullStateChange((0 == that.data.pullState) ? 0 : PULL_LT_HEIGHT, dynamicHeight)
        }
    },
    //页面触摸结束事件，必须在触摸开始方法中调用此方法
    handletouchend: function (event) {
      var that = this;
      let refreshHeight = that.data.refreshHeight
      if (0 == that.data.pullState) {
        that._pullStateChange(PULL_REFRESHING, refreshHeight)
        return
      }
      let dynamicHeight = that.data.dynamicHeight
      if (that.data.scrollTop > 0 && PULL_DEFAULT != that.data.pullState) {
        // let top = that.data.scrollTop / wx.getSystemInfoSync().windowWidth * 20
        //2 * that.data.scrollTop 两倍表示p?x转rp?x，  所以这里必须进行单位转换
        if (dynamicHeight - scale * that.data.scrollTop > refreshHeight) {
          that._pullStateChange(PULL_REFRESHING, refreshHeight)
          //刷新事件 回调出去
          that.triggerEvent("onRefresh")
        } else {
          that._pullStateChange(PULL_DEFAULT, 0)
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
        }
        return
      }
      if (dynamicHeight >= that.data.refreshHeight) {
        that._pullStateChange(PULL_REFRESHING, refreshHeight)
        //刷新事件 回调出去
        that.triggerEvent("onRefresh")
      } else {
        that._pullStateChange(PULL_DEFAULT, 0)
      }
    },
    //页面触摸取消事件，必须在触摸开始方法中调用此方法
    handletouchcancel: function (event) {
      var that = this;
      that._pullStateChange(PULL_DEFAULT, 0)
    },
    //页面滚动
    handlePageScroll: function (e) {
      var that = this;
      var event = e.detail;
      if (event.scrollTop > 0 && PULL_DEFAULT != that.data.pullState) {
        //2 * that.data.scrollTop 两倍表示表示p?x转rp?x，  所以这里必须进行单位转换
        if (that.data.dynamicHeight - scale * event.scrollTop < that.data.refreshHeight) {
          that.setData({
            pullState: PULL_LT_HEIGHT
          })
        } else {
          that.setData({
            pullState: PULL_GT_HEIGHT
          })
        }
      }
      that.data.scrollTop = event.scrollTop
    },
    //是否是安卓平台
    _isAndriod() {
      return 'ios' == platform
    },
    //下拉状态监听
    _pullStateChange(state, dynamicHeight) {
      var that = this;
      that.setData({
        pullState: state,
        dynamicHeight: dynamicHeight
      })
      that.triggerEvent("onPullState")
    }
  }
})