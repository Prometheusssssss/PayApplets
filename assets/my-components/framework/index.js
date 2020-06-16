// assets/my-component.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    sliderBar: {
      type: String,
      value: 'false'
    },
    contentBg: {
      type: String,
      value: "",
    },

    defaultPageSize: {
      type: Number,
      value: "",
    },
    lockScroll: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollTop: '',
    contentHeight: '',
    loadStatus: 0, //0 加载完成 1 加载中 2
    topNum: '',

    allowedRefresh: 0,//允许更新
    allowedLoad: 0,//允许加载

    pageNo: 1,//当前位置
    refreshPageNo: '',//需要恢复的分页位置
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    ready: function () {
      var that = this;
      //注册页面加载事件
      setTimeout(() => {
        this.createIntersectionObserver().relativeToViewport().observe('.load', (res) => {
          if (res.intersectionRect.height > 0 && that.data.loadStatus == 0 && that.data.allowedLoad == 1) {
            that.setData({
              loadStatus: 1,
            })
            that.dealPageNoSize("load")
          }
        })
      }, 2000)

      //获取 contentHeight 的高度 开始
      const query = this.createSelectorQuery();
      query.select('.content').boundingClientRect();
      query.exec(function (res) {
        that.setData({
          contentHeight: res[0].height
        })
      })
      this.refreshView = this.selectComponent("#refreshView")
      //获取 contentHeight 的高度 结束

    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //refreshView start
    //触摸开始
    handletouchstart: function (event) {
      if (this.data.allowedRefresh.toString() == '1') {
        this.refreshView = this.selectComponent("#refreshView")
        if (this.refreshView != null) { this.refreshView.handletouchstart(event) }
      }
    },
    //触摸移动
    handletouchmove: function (event) {
      if (this.data.allowedRefresh.toString() == '1') {
        this.refreshView = this.selectComponent("#refreshView")
        if (this.refreshView != null) { this.refreshView.handletouchmove(event) }
      }
    },
    //触摸结束
    handletouchend: function (event) {
      if (this.data.allowedRefresh.toString() == '1') {
        this.refreshView = this.selectComponent("#refreshView")
        if (this.refreshView != null) { this.refreshView.handletouchend(event) }
      }
    },
    //触摸取消
    handletouchcancel: function (event) {
      if (this.data.allowedRefresh.toString() == '1') {
        this.refreshView = this.selectComponent("#refreshView")
        if (this.refreshView != null) { this.refreshView.handletouchcancel(event) }
      }
    },
    //页面滚动事件
    scrollViewEventHander: function (event) {
      if (this.data.allowedRefresh.toString() == '1') {
        this.refreshView = this.selectComponent("#refreshView");
        if (this.refreshView != null) { this.refreshView.handlePageScroll(event) }
      }
    },
    //取消页面滚动
    mystopPullRefresh: function () {
      var that = this;
      if (this.data.allowedRefresh.toString() == '1') {
        setTimeout(() => {
          this.refreshView = this.selectComponent("#refreshView")
          if (this.refreshView != null) { that.refreshView.stopPullRefresh() }
        }, 1000)
      }
    },
    //当页面刷新触发时
    onPullDownRefresh: function () {
      var that = this;
      if (this.data.allowedRefresh.toString() == '1') { that.dealPageNoSize("refresh") }
    },
    //refreshView end
    //取消页面加载
    mystopLoad: function () {
      var that = this;
      setTimeout(() => {
        that.setData({
          loadStatus: 0,
        })
      }, 100)
    },
    // 一键回到顶部
    goTop: function (e) {
      this.setData({
        topNum: this.data.topNum = 0
      });
    },

    updateRefreshPageNo: function () {
      var that = this;
      that.setData({
        refreshPageNo: that.data.pageNo
      });
    },

    dealPageNoSize: function (type) {
      var that = this;
      var pageNo = that.data.pageNo, pageSize = that.data.defaultPageSize, refreshPageNo = that.data.refreshPageNo;
      switch (type) {
        case "enter": {
          if (refreshPageNo != '') {
            //从明细返回
            that.dealPageNoSize('reload');
            return;
          } else {
            pageNo = 1;
          }
          break;
        }
        case "reload": {
          pageNo = 1;
          pageSize = that.mul(pageSize, that.data.refreshPageNo);
          break;
        };
        case "refresh": {
          pageNo = 1;
          break;
        }
        case "load": {
          pageNo = pageNo + 1;
          break;
        }
        default: {
          break;
        }
      }
      that.setData({
        pageNo: pageNo
      })
      that.triggerEvent("CallBackFunction", { type: type, pageNo: pageNo, pageSize: pageSize })
    },

    dealWithList: function (type, dataList, pageSize) {
      var that = this;
      var totalList = [];
      var returnSetObj = {};
      switch (type) {
        case "enter": {
          that.goTop();
          that.mystopLoad();
          totalList.push(dataList);
          returnSetObj.totalList = totalList;
          break;
        }
        case "reload": {
          totalList.push(dataList);
          returnSetObj.totalList = totalList;
          var refreshPageNo = that.data.refreshPageNo;
          that.setData({
            refreshPageNo: '',
            pageNo: refreshPageNo,
          })
          break;
        };

        case "refresh": {
          that.goTop();
          that.mystopPullRefresh();
          totalList.push(dataList);
          returnSetObj.totalList = totalList;

          break;
        }
        case "load": {
          this.mystopLoad();
          console.log('load', index, dataList)
          var index = that.data.pageNo - 1;
          returnSetObj["totalList[" + index + "]"] = dataList;
          break;
        }
        default: {
          break;
        }
      }
      if (dataList.length < pageSize) {
        that.setData({
          allowedLoad: 2,
          allowedRefresh: 1,
        })
      } else {
        that.setData({
          allowedLoad: 1,
          allowedRefresh: 1,
        })
      }
      that.triggerEvent("CallBackSetData", { returnSetObj: returnSetObj })
    },
  }
})
