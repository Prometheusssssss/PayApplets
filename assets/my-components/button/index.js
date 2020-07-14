// assets/my-components/button/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    buttonColor: {
      type: String,
      value: ""
    },
    title: {
      type: String,
      value: ""
    },
    shape: {
      type: String,
      value: ""
    },
    dataItem: {
      type: String,
      value: ""
    },
    dataArr: {
      type: Array,
      value: ""
    },
    dataObj: {
      type: Object,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    lastTime: 0,
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    ready: function () {
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick: function (e) {
      var that = this;
      var { dataset } = e.currentTarget;
      // var date = new Date();
      // var time = date.toLocaleTimeString() + ':' + date.getMilliseconds()
      that.throttle(that.triggerMyEvent, 2000)(dataset)

    },

    triggerMyEvent: function (dataset) {
      var that = this;
 
      that.triggerEvent('ButtonClick', dataset);
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
        console.log('time')
        console.log(time)
        if (time - lastTime > gapTime || !lastTime) {
          func.apply(that, args)
          that.data.lastTime = time;
        }
      }
    }
  }
})