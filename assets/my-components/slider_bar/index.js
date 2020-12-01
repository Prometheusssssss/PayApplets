// assets/my-components/silider-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array,
      value: ""
    },
    itemsKey: {
      type: String,
      value: ""
    },
    itemShowName: {
      type: String,
      value: ""
    },
    current: {
      type: String,
      value: ""
    },
    bottomIconName: {
      type: String,
      value: ""
    },
    showSlider: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange: function (e) {
      var {
        name
      } = e.currentTarget.dataset;
      var {
        id
      } = e.currentTarget.dataset;
      // wx.showLoading({
      //   title: '加载中',
      //   mask: true,
      // });
      this.triggerEvent(
        'ChangeSliderBar', {
          'NAME': name,
          'KID': id
        });
    },
    iconEvent: function (e) {
      this.triggerEvent(
        'bottomEvent', );
    }
  }
})