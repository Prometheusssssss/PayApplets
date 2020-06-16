// assets/my-componet/search/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    startDate:{
      type:String,
      value:''
    },
    endDate:{
      type:String,
      value:''
    },
    type:{
      type:String,
      value:''
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
    changeDateStart:function({detail}){
      var that = this;
      // that.setData({
      //   startDate:detail.value
      // })
      this.triggerEvent('StartDateEvent', detail);
    },
    changeDateEnd:function({detail}){
      this.triggerEvent('EndDateEvent',detail)
    },
    searchdate:function(){
      this.triggerEvent('SearchEvent')
    }
  }
})
