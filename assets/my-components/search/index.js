// var recorder = require("../../../pages/public-js/recorder.js");
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['pri-class'],
  properties: {
    placeholder: {
      type: String,
      value: ''
    },
    initValue: {
      type: String,
      value: ''
    },
    voice: {
      type: String,
      value: 'true'
    },
    type: {
      type: String,
      value: ''
    },
    rangeKey: {
      type: String,
      value: ''
    },
    rangeList: {
      type: Array,
      value: ''
    },
    iconName: {
      type: String,
      value: ''
    },
    rightIconName: {
      type: String,
      value: '',
    },
    allowedClear: {
      type: Boolean,
      value: true,
    },
    allowedPicker: {
      type: Boolean,
      value: true,
    },
    rightIconStyle: {
      type: String,
      value: '',
    },
    picker: {
      type: Boolean,
      value: false,
    },
    pickerList:{
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    voiceStatus: 'stop',
    startTimeStamp: '',
    pickerIndex: 0,
    pickerList:[]
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      var that = this;
      that.loadPickerList();
      // that.loadCountry();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadPickerList: function () {
      // this.triggerEvent('InputEvent', detail.value);
    },
    handleInput: function ({
      detail
    }) {
      this.triggerEvent('InputEvent', detail.value);
    },
    handleClear: function ({
      detail
    }) {
      this.triggerEvent('InputEvent', '');
    },

    handleClick: function ({
      detail
    }) {
      this.triggerEvent('RightEvent', detail.value);
    },
    bindPickerChange:function({
      detail
    }){
      var that = this;
      that.setData({pickerIndex: detail.value})
      this.triggerEvent('PickerEvent', detail);
    },
  }
})