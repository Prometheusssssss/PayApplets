// pages/extractCach/extractCach-apply.js
const app = getApp()
const {
  common
} = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountAmount:100,
    payMentList:[{
      KID:0,
      NAME:'微信'
    },{
      KID:1,
      NAME:'支付宝'
    }],
    paymentIndex:0,
    applyInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindPayMent:function(e){
    var that = this;
    that.setData({
      paymentIndex: e.detail.value,
    })
  },
  saveExtactValue:async function(e){
      var that = this;
      var data = that.data;
      var form = e.detail.value;
      // 校验必填项，专区，大区，价格（非空数字），商品名称，

      if (common.validators.isInValidNum(form.APPLY_PRICE, '价格') ) {
        return;
      }
      if (common.validators.isEmptyText(form.APPLY_ACCOUNT, '提现账户') ) {
        return;
      }
      if(form.APPLY_PRICE<50){
        wx.showToast({
          title: '提现金额必须大于50元',
          icon:'none',
          duration:1000
        })
        return
      }else if(form.APPLY_PRICE>data.accountAmount){
        wx.showToast({
          title: '提现金额必须小于账户余额',
          icon:'none',
          duration:1000
        })
        return
      }
      wx.showLoading({
        title: '保存中...',
      })
      var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
      var p = {
        KID:-1,
        USER_ID: app.getUser().id,//商品名称
        USER_NAME: app.getUser().name,//商品名称
        USER_PHONE: app.getUser().tel,//商品详情
        STATUS:'审核中',//状态
        APPLICATION_TIME: time,//商品
        APPLICATION_AMOUNT: form.APPLY_PRICE,//商品
        PAY_MODE: data.payMentList[data.paymentIndex].NAME,//卖家id
      }
      console.log('发布')
      console.log(JSON.stringify(p))
      // 加个放2秒内只能点击一次有效
      that.createExtractRecord(p)
  },
  createExtractRecord: function (p) {
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_withdrawal', '', p, 'POST').then((result) => {
      wx.hideLoading()
      if (result != 'error') {
        setTimeout(()=>{
          wx.navigateTo({
            url: '../extractCach/extractCach-record',
          })
        },200)
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 1500
        })
      }
    })
    
  },

})