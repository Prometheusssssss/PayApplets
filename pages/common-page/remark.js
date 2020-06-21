const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    type: '',
    updatelocalText: '',
    updateTable: '',
    updateText: '',
    updateId: '',
    title: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var {
      /**value 初始值
       * type 类型（sql/local)更新表/更新本地对象
       * updatelocalText 更新的本地对象
       * updateTable 更新的表
       * updateText 更新的字段
       * updateId 更新的id
       */
      value,
      type,
      updatelocalText,
      updateTable,
      updateText,
      updateId,
      title
    } = options;
    if (title == '' || title == undefined) {

    } else {
      wx.setNavigationBarTitle({
        title: title,
      });
    }
    var that = this;
    that.setData(options)
  },
  getRemark: function () {
    var that = this;
    var {
      value,
      type,
      updatelocalText,
      updateTable,
      updateText,
      updateId,
    } = that.data;
    if (type == 'sql') {
      var p = {
        [updateText]: value,
      }
      app.CrudUpdate(updateTable, updateId, p).then((data) => {
        wx.showToast({
          icon: 'none',
          title: '更新成功',
          duration: 1500,
          complete: function () {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        })
      }, (reject) => {});
    } else if (type == 'local') {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面

      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        [updatelocalText]: value
      })
      wx.showToast({
        icon: 'none',
        title: '更新成功',
        duration: 1500,
        complete: function () {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })

    }

  },
  clearRemark: function () {
    var that = this;
    that.setData({
      value: '',
    })
  },
  bindChangeTextArea: function (e) {
    var that = this;
    that.setData({
      value: e.detail.value,
    })
  }
})