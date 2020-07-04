Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  externalClasses: ['i-class'],

  properties: {
    sliderId: {
      type: String,
      value: ""
    },
    activeId: {
      type: String,
      value: "",
    },
    info: Object,
    buttonArray: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal, changedPath) {
        var totalWidth = 0;
        for (var b of newVal) {
          totalWidth += b.width;
        }
        this.setData({
          totalWidth: totalWidth
        })
      }
    }

  },
  data: {
    startX: 0, //开始坐标
    startY: 0,
    totalWidth: 0,
    sliderWidth: 0,
    ListTouchDirection:'',// 'right' : 'left'

  },



  methods: {
    // 触摸开始
    handleTouchstart(e) {
      var that = this;
      var currentId = e.currentTarget.dataset.target;
      that.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
      })
    },
    // 计算方向
    handleTouchmove(e) {
      var that = this;
      var currentId = e.currentTarget.dataset.target,
        startX = that.data.startX, //开始X坐标
        startY = that.data.startY, //开始Y坐标
        touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
        touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
        //获取滑动角度
        angle = that.angle({
          X: startX,
          Y: startY
        }, {
            X: touchMoveX,
            Y: touchMoveY
          });
      if (Math.abs(angle) > 30) {
        return;
      } else {
        that.setData({
          ListTouchDirection: touchMoveX > startX > 0 ? 'right' : 'left'
        })
      }
    },

    // 计算滚动
    handleTouchend(e) {
      var that = this;
      if (that.data.ListTouchDirection == 'left') {
        var currentId = e.currentTarget.dataset.target;
        that.triggerEvent('activeSliderId', currentId);
      } else {
        that.triggerEvent('activeSliderId', -1);
      }
      that.setData({
        ListTouchDirection: null
      })
    },

    //返回角度 /Math.atan()返回数字的反正切值
    angle: function (start, end) {
      var _X = end.X - start.X,
        _Y = end.Y - start.Y
      return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },

    handleClick: function (e) {
      var currentid = e.currentTarget.dataset.currentid, info = e.currentTarget.dataset.info, triggerEvent = e.currentTarget.dataset.triggerEvent;
      this.triggerEvent(triggerEvent, {
        currentid: currentid,
        info: info
      });
    }
  }
});