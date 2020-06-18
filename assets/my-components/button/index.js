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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick: function(e) {
      var { dataset } = e.currentTarget;
      this.triggerEvent('ButtonClick', dataset);
    }
  }
})