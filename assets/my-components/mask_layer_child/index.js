// assets/my-components/mask_layer/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },


  relations: {
    '../input_view/index': {
      type: 'child', // 关联的目标节点应为子孙节点
      linked: function (target) {
 
        // mask-lay-child被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
      },
      linkChanged: function (target) {
 
        // mask-lay-child被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function (target) {
 
        // mask-lay-child被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    addLineHeight: {
      type: Number,
      value: undefined,
      observer: function (newVal, oldVal, changedPath) {
        var contentStyleStr = `height:${newVal + 682}rpx;top:calc(50vh - ${newVal / 2 + 341}rpx);`;
        var closeStyleStr = `top:calc(50vh + ${343 + newVal / 2}rpx);`
        this.setData({
          contentStyleStr: contentStyleStr,
          closeStyleStr: closeStyleStr
        })
      }
    },
    visible: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
 
      }
    },
    hasTitleArea: {
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal, changedPath) { }
    },
    hasButtonArea: {
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal, changedPath) { }
    },
    hasImageArea: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) { }
    },
    hasContent: {
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal, changedPath) {
      }
    },
    maskLayerName: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {
      }
    },
    closeSomeMaskLayerName: {
      type: Boolean,
      value: '',
      observer: function (newVal, oldVal, changedPath) {

      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    closeMaskLayer: function (e) {
      this.setData({
        visible: false,
      })
      this.triggerEvent('Close', e.detail);

    }
  }
})