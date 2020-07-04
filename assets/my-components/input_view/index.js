// assets/my-components/button/index.js
Component({
  options: {
    styleIsolation: 'isolated',
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  relations: {
    '../mask_layer/index': {
      type: 'ancestor', // 关联的目标节点应为子孙节点
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
    dataName: {
      type: String,
      value: ""
    },
    initValue: {
      type: String,
      value: ""
    },
    expandA: {
      type: String,
      value: ""
    },
    expandB: {
      type: String,
      value: ""
    },
    expandC: {
      type: String,
      value: ""
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    num: 0,
    showNumMaskLayer: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    commitNum: function () {
      var that = this;
      var value = that.data.showNum;
      var name = that.data.dataName;
      that.setData({
        showNumMaskLayer: false,
      })
      that.changeParent(false);
      this.triggerEvent('pageSetData', { dataName: name, value: value });

    },

    showView: function () {
      var that = this;
 
      that.setData({
        showNumMaskLayer: true,
        showNum: that.data.initValue,
        firstIn: true,
      })
      that.changeParent(true);
    },

    cancel: function () {
      var that = this;
      that.changeParent(false);
      // that.setData({ showNumMaskLayer: false })
    },

    changeParent: function (childShow) {
      // 使用getRelationNodes可以获得nodes数组，包含所有已关联的custom-li，且是有序的
      var nodes = this.getRelationNodes('../mask_layer/index')
 
      if (nodes && nodes.length > 0) {
        nodes[0].setData({ childShow: childShow })
      }
    },

    setNum: function (e) {
      var that = this;
      var firstIn = that.data.firstIn;
      var showNum = that.data.showNum
      var num = e.currentTarget.dataset.inputText;
      if (firstIn == true) {
        that.setData({
          ["showNum"]: num,
          firstIn: false,
        })
      } else {
        if (showNum == '0' && num != '.') {
          that.setData({
            ["showNum"]: num,
          })
        } else {
          that.setData({
            ["showNum"]: showNum + '' + num
          })
        }
      }
    },

    deleteNum() {
      var that = this;
      var num = that.data.showNum;
      if (num.toString().length > 0) {
        that.setData({
          ["showNum"]: num.toString().substring(0, num.toString().length - 1)
        })
      }
    },

    clearNum: function () {
      var that = this;
      var num = 0;
      that.setData({
        ["showNum"]: num
      })
    },


  }
})