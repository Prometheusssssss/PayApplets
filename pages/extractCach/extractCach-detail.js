// pages/customerOrder/customerOrder-detail.js
const app = getApp()
const {
  common
} = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    extractInfo : '',
    showConfirmOff:false,
    showConfirmPay: false,
    finalApplyAmount:0,
    accountBalance:0,
    showConfirmServerPay:false,
    lastTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var extractInfo = JSON.parse(options.extractInfo);
    if(extractInfo.APPLICATION_AMOUNT ==null)
      extractInfo.APPLICATION_AMOUNT = 0
    console.log('orderUtem')
    console.log(extractInfo)
    that.setData({extractInfo:extractInfo})
    //查询最新的账户余额
  },
  onShow: function () {
    var that = this;
    that.loadUserInfo()
  },
  loadUserInfo:function(){
    var that = this;
    var p = {"KID": that.data.extractInfo.USER_ID}//提现人的账户余额
    var url = `/api/_search/defaultSearch/a_user?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
      if (dataList != 'error') {
        that.setData({accountBalance: dataList[0].BALANCE})
      }
    })
  },
  //打回
  refuseApply:function(){
    var that = this;
    that.setData({showConfirmOff:true})
  },
  confirmOff:function(){
    var that = this;
    var p = {
      KID: that.data.extractInfo.KID,
      STATUS: '已打回',
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_withdrawal', '', p, 'POST').then((result) => {
      if (result != 'error') {
        //更新订单
        wx.showToast({
          title: '打回成功',
          icon: 'none',
          duration: 1500
        })
        that.returnBackMsg()
        that.setData({
          ['extractInfo.STATUS']:'已打回',
          showConfirmOff:false
        })
      }
    })
  },
  returnBackMsg:function(){
    var that = this;
    var item = that.data.extractInfo;
    //先插入消息表吧  给买家发消息 
    var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    var p = {
      THEME:'提现打回提醒',
      USER_ID: that.data.extractInfo.USER_ID,
      USER_NAME: that.data.extractInfo.USER_NAME,
      USER_PHONE: that.data.extractInfo.USER_PHONE,
      CONTENT: '提现打回',//商品名称
      STATUS: "已发送",
      SEND_TIME: time
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_message', '', p, 'POST').then((result) => {   
      if (result != 'error') {
    
      }
    })
  },
  checkApply:function(){
    var that = this;
    var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    var p = {
      KID: that.data.extractInfo.KID,//审核人id name 审核时间
      APPROVAL_USER_NAME: app.getUser().name,
      APPROVAL_USER_ID: app.getUser().id,
      APPROVAL_TIME: time,
      STATUS: '已审核',
    }
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_withdrawal', '', p, 'POST').then((result) => {
      if (result != 'error') {
        //更新订单
        wx.showToast({
          title: '审核成功',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          ['extractInfo.STATUS']:'已审核',
          ['extractInfo.APPROVAL_USER_NAME']: app.getUser().id,
          ['extractInfo.APPROVAL_TIME']: time,
        })
      }
    })
  },
  // 1、用户提现那里不会更新最新的账户余额 
  //2、账户余额字段 付款人id name还是要的 
  //3、账户余额应该实时查询最新，提现校验列表页面不显示账户余额，详情查询最新的余额，几个金额字号大一点，余额不足了，标红提现金额
  //4、客服付款保存的时候，弱校验提现金额如果大于了账户余额也可提现，账户余额为负数5、付款保存的时候多加一层校验


  //弹出可以修改金额弹框  默认等于提现金额 修改小于提现金额 不可大于提现金额
  //确认后更新状态为已打款 并且生成流水类型为支出，支出类型为商品
  payApply:function(){
    var that = this;
    that.setData({
      showConfirmPay:true,
      firstIn: true,
      finalApplyAmount: that.data.extractInfo.APPLICATION_AMOUNT
    })
  },
  //计算器开始
  commitPrice: async function () {
    var that = this;
    var finalApplyAmount = Number(that.data.finalApplyAmount);
    var originApplyAmount = that.data.extractInfo.APPLICATION_AMOUNT;
    var accountBalance = that.data.accountBalance
    var gapTime = 2000;
    var lastTime = that.data.lastTime ;
    if (common.validators.isInValidNum(finalApplyAmount, '价格') ) {
      return;
    }
    if(finalApplyAmount>= originApplyAmount){
      wx.showToast({
        title: '打款金额不能高于提现金额',
        icon:'none',
        duration:1000
      })
      return
    }


    //提现金额大于账户余额 确认是否打款，确认打款后更新账户余额
    if(finalApplyAmount> accountBalance){
        that.setData({
          showConfirmPay:false,
          showConfirmServerPay:true,
        })
    }else {
      console.log('提现金额小于等于打款金额')
      // 防重复点击校验
      let time = + new Date();
      if (time - lastTime > gapTime || !lastTime) {
        console.log('执行')
        that.updatePayAmount()
        that.setData({lastTime:time})
      }
      
    }
 
  },
  confirmServerPay:function(){
    var that = this;
    that.setData({showConfirmServerPay:false})
    var gapTime = 2000;
    var lastTime = that.data.lastTime ;
    // 防重复点击校验
    let time = + new Date();
    if (time - lastTime > gapTime || !lastTime) {
      console.log('执行')
      that.updatePayAmount()
      that.setData({lastTime:time})
    }
  },
  updatePayAmount:function(){
    var that = this;
    var finalApplyAmount = that.data.finalApplyAmount;
    // var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    //提现金额大于账户余额 确认是否打款，确认打款后更新账户余额

    //更新提现单 ，账户流水插入支付类型。可用资金减少，用打款金额扣除，可用资金可以为负数，发送提现消息给提现客户
    var p = {
      KID: that.data.extractInfo.KID,
      ORDER_CODE:  that.data.extractInfo.CODE,
      PAY_USER_NAME: app.getUser().name,
      PAY_USER_ID : app.getUser().id,
      PAY_AMOUNT: finalApplyAmount,
      ORDER_AMOUNT: that.data.extractInfo.APPLICATION_AMOUNT,
      USER_ID: that.data.extractInfo.USER_ID,
      USER_NAME: that.data.extractInfo.USER_NAME,
      USER_PHONE: that.data.extractInfo.USER_PHONE,
    }
    console.log(p)
    app.ManageExecuteApi('/api/_cud/submitOrder', '', p, 'POST').then((result) => {
      if (result != 'error') {
        //成功之后插入账户流水为支出类型流水 调用流水表插入数据
        wx.showToast({
          title: '打款成功',
          icon: 'none',
          duration: 1500
        })
        //可能需要返回一个付款时间
        that.loadUserInfo()
        that.setData({
          ['extractInfo.STATUS']:'已打款',
          ['extractInfo.PAY_AMOUNT']: result[0].PAY_AMOUNT,
          ['extractInfo.PAY_USER_NAME']: result[0].PAY_USER_NAME,//付款人
          ['extractInfo.PAY_TIME']: result[0].PAY_TIME,//付款时间
          showConfirmPay:false,
        })
      }
    })
    // app.ManageExecuteApi('/api/_cud/createAndUpdate/b_withdrawal', '', p, 'POST').then((result) => {
    //   if (result != 'error') {
    //     //成功之后插入账户流水为支出类型流水 调用流水表插入数据
    //     wx.showToast({
    //       title: '打款成功',
    //       icon: 'none',
    //       duration: 1500
    //     })
    //     that.setData({
    //       ['extractInfo.STATUS']:'已打款',
    //       ['extractInfo.PAY_AMOUNT']: finalApplyAmount,
    //       ['extractInfo.PAY_USER_NAME']: app.getUser().name,//付款人
    //       ['extractInfo.PAY_TIME']: time,//付款时间
    //       showConfirmPay:false,
    //     })
    //     // that.createAccountRecord()
    //   }
    // })
  },
  createAccountRecord: function(){
    var that = this;
    var time = common.time.formatDay(new Date())+' '+common.time.formatTime(new Date());
    //提现审核完的流水 用户id应该是卖家的 还是客服还是买家的
    var p = {
      USER_ID: app.getUser().id,
      USER_NAME: app.getUser().name,
      USER_PHONE: app.getUser().tel,
      TYPE: '支出',
      RECEIVE_TYPE: '商品',
      SELETTMENT_STATUS:'已结算',
      SELETTMENT_TIME: time,
      SELETTMENT_AMOUNT: that.data.finalApplyAmount,
      ORDER_AMOUNT: that.data.extractInfo.APPLICATION_AMOUNT,
    }
    
    console.log('生成账户流水参数')
    console.log(p)
    app.ManageExecuteApi('/api/_cud/createAndUpdate/b_account_record', '', p, 'POST').then((result) => {
      // wx.hideLoading()
      if (result != 'error') {
        console.log('生成流水成功')
      }
    })
  },
  setPrice: function (e) {
    var that = this;
    var firstIn = that.data.firstIn;
    var finalApplyAmount = that.data.finalApplyAmount
    var num = e.currentTarget.dataset.inputText;
    if (firstIn == true) {
      that.setData({
        ["finalApplyAmount"]: num,
        firstIn: false,
      })
    } else {
      if (finalApplyAmount == '0' && num != '.') {
        that.setData({
          ["finalApplyAmount"]: num,
        })
      } else {
        that.setData({
          ["finalApplyAmount"]: finalApplyAmount + '' + num
        })
      }
    }
  },
  deletePrice: function (e) {
    var that = this;
    var num = that.data.finalApplyAmount;
    if (num.toString().length > 0) {
      that.setData({
        ["finalApplyAmount"]: num.toString().substring(0, num.toString().length - 1)
      })
    }
  },

  clearPrice: function () {
    var that = this;
    var num = 0;
    that.setData({
      ["finalApplyAmount"]: num
    })
  },

  cancel: function () {
    var that = this;
    that.setData({ showConfirmPay: false })

  },//计算器结束\
 
})