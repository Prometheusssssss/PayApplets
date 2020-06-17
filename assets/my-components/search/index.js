var recorder = require("../../../pages/public-js/recorder.js");
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
    rightIconStyle: {
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    voiceStatus: 'stop',
    startTimeStamp: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
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


    startVoice: function (e) {
      var that = this;


      that.data.startTimeStamp = e.timeStamp;
      recorder.recorderManagerStart(that, 'searchList');
    },

   
    endVoice: function (e) {
      var that = this;
      var startTimeStamp = that.data.startTimeStamp;
      var endTimeStamp = e.timeStamp;



      if(endTimeStamp - startTimeStamp>=1000){

        that.end();
      }else{

        that.endQuick();
      }
     
      // recorder.recorderManagerStop(that, 'searchList');
    },

    end: function () {
      var that = this;

      recorder.recorderManagerStop(that, 'searchList');
    },

    endQuick: function () {
      var that = this;

      recorder.recorderManagerStopAndNoUpload(that, 'searchList');
    },


    setVoiceStatus: function (status, targetType) {
      var that = this;
      that.setData({
        voiceStatus: status,
      })
    },

    searchProductListByVoice: function (searchText) {

      var that = this;
      that.setData({
        initValue: searchText
      })
      this.triggerEvent('InputEvent', searchText);
    },

  }
})