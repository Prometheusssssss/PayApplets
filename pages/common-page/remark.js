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
  getRemark: async function () {
    var that = this;
    var {
      value,
      type,
      updatelocalText,
      updateTable,
      updateText,
      updateId,
    } = that.data;
    var isEmoji = await that.isEmojiCharacter(value); 
    if(isEmoji && isEmoji !=undefined){
      wx.showToast({
        title: '暂不支持表情包使用哦~',
        icon:'none',
        duration:2000
      })
      return
    }
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
  },
  isEmojiCharacter: async function(substring) {
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2B05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
          hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
          hs == 0x2b50) {
          return true;
        }
      }
    }
  }
})