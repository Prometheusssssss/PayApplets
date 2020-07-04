// assets/my-components/mask_layer/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    addLineHeight: {
      type: Number,
      value: undefined,
      observer: function (newVal, oldVal, changedPath) {
        var styleStr=`height:${newVal+374}rpx;top:calc(50vh - ${newVal/2+187}rpx);`;
        this.setData({
          styleStr:styleStr,
        })
      }
    },
    visible: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {}
    },
    title: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    styleStr:'',
    lastTime: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancelEvent: function () {
      this.setData({
        visible: false,
      })
      this.triggerEvent('CancelEvent', {});
    },

    confirmEvent: function () {
      var that = this;
      that.throttle(that.triggerMyEvent, 2000)()
      // that.debounce(() => {
 
      // }, 1200)

    },
    triggerMyEvent: function () {
      var that = this;
 
      this.triggerEvent('ConfirmEvent', {});
    },

    throttle: function (func, gapTime) {
      const that = this;
      if (typeof func !== 'function') {
        throw new TypeError('need a function');
      }
      gapTime = +gapTime || 0;
      var lastTime = that.data.lastTime;
      return function () {
        const args = arguments;
        let time = + new Date();
        if (time - lastTime > gapTime || !lastTime) {
          func.apply(that, args)
          that.data.lastTime = time;
        }
      }
    }
  }
})