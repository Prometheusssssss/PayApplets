const BigNumber = require('bigNumber.js');
const time = {
  formatDay: function(localDateTime) {
    return (localDateTime.getFullYear().toString()) + "-" + ((localDateTime.getMonth() + 1).toString().length < 2 ? '0' + (localDateTime.getMonth() + 1).toString() : (localDateTime.getMonth() + 1).toString()) + "-" + (localDateTime.getDate().toString().length < 2 ? '0' + localDateTime.getDate().toString() : localDateTime.getDate().toString());
  },

  formatTime: function(localDateTime) {
    return (localDateTime.getHours().toString().length < 2 ? '0' + localDateTime.getHours().toString() : localDateTime.getHours().toString()) + ":" + (localDateTime.getMinutes().toString().length < 2 ? '0' + localDateTime.getMinutes().toString() : localDateTime.getMinutes().toString()) + ":" + (localDateTime.getSeconds().toString().length < 2 ? '0' + localDateTime.getSeconds().toString() : localDateTime.getSeconds().toString());
  },
  addOneDay:function(date){
     var dateTime = new Date(date);
      dateTime = dateTime.setDate(dateTime.getDate() + 1);
      dateTime = new Date(dateTime);
      var newDate = dateTime.toLocaleDateString().replace(/\//g,"-");
      return newDate;
 },
  dayString: function() {
    let nowTime = new Date();
    return time.formatDay(nowTime);
  },
  tomorrowDayString: function() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)
    return time.formatDay(tomorrow);
  },

  fullDateString: function() {
    let nowTime = new Date();
    return time.formatDay(nowTime) + ' ' + time.formatTime(nowTime)
  },
  formatNumber: function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
 },
  formatTimeTwo: function(number, format) {
      var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
      var returnArr = [];

      var date = new Date(number * 1000);
      returnArr.push(date.getFullYear());
      returnArr.push(time.formatNumber(date.getMonth() + 1));
      returnArr.push(time.formatNumber(date.getDate()));

      returnArr.push(time.formatNumber(date.getHours()));
      returnArr.push(time.formatNumber(date.getMinutes()));
      returnArr.push(time.formatNumber(date.getSeconds()));

      for (var i in returnArr) {
          format = format.replace(formateArr[i], returnArr[i]);
      }
      return format;
  }
}

const mathEquation = {
  add: function(a1, a2) {
    a1 = a1 == undefined ? 0 : a1;
    a2 = a2 == undefined ? 0 : a2;
    let b1 = new BigNumber(Number(a1)) // "11"
    let b2 = new BigNumber(Number(a2)) // "1295.25"
    let c = b1.plus(b2)
    return c.toString();
  },
  sub: function(a1, a2) {
    a1 = a1 == undefined ? 0 : a1;
    a2 = a2 == undefined ? 0 : a2;
    if (Number(a2) == 0) {
      return a1;
    } else if (Number(a1) == 0) {
      return mathEquation.mul(a2, -1);
    } else {
      a2 = mathEquation.mul(a2, -1);
      let b1 = new BigNumber(Number(a1)) // "11"
      let b2 = new BigNumber(Number(a2)) // "1295.25"
      let c = b1.plus(b2)
      return c.toString();
    }

  },
  mul: function(a1, a2) {
    a1 = a1 == undefined ? 0 : a1;
    a2 = a2 == undefined ? 0 : a2;
    // if (a1 == 0 || a2 == 0) {
    //   return 0;
    // }
    // var m = 0,
    //   s1 = a1.toString(),
    //   s2 = a2.toString();
    // try {
    //   m += s1.split(".")[1].length;
    // } catch (e) { }
    // try {
    //   m += s2.split(".")[1].length;
    // } catch (e) { }

    // 
    // return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    let b1 = new BigNumber(Number(a1)) // "11"
    let b2 = new BigNumber(Number(a2)) // "1295.25"
    let c = b1.multipliedBy(b2)
    return c.toString();
  },
  div: function(a1, a2) {
    a1 = a1 == undefined ? 0 : a1;
    a2 = a2 == undefined ? 0 : a2;
    if (a1 == 0 || a2 == 0) {
      return 0;
    }
    let b1 = new BigNumber(Number(a1)) // "11"
    let b2 = new BigNumber(Number(a2)) // "1295.25"
    let c = b1.dividedBy(b2)
    return c.toString();

  }
}

const arrayProcessing = {
  getArrayDetail: function(arr, k) {
    let kArr = [],
      returnArr = [];
    arr.map((ele) => {
      if (kArr.length == 0 || kArr.indexOf(ele[k]) < 0) {
        kArr.push(ele[k])
      }
    });
    var k = k.toString();
    kArr.map((ele) => {
      //根据kid过滤配送任务 分成多个配送任务
      let itemDetail = arr.filter((detailEle) => {
        return detailEle[k] == ele
      })
      //每一个配送任务 根据地址
      let item = {
        k: ele,
        DETAIL: itemDetail
      }
      returnArr.push(item);
    })
    return returnArr;

  },
  /**
   * 讲数组中的status_value=>转换成相对应的status_css
   * @param {转换的数组} arr 
   * @param {*} type a/b/c
   */
  convertStatusCss: function(arr, type, convertType = "all") {
    switch (type) {
      // 采购询价11
      case "purchase-inquiry":
        arr.map(item => {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              // Preformed/预制=>询价 Submitted/已提交=>待审核 Completed/已完成=>完成
              case "Preformed":
                item.STATUS_NAME = "询价";
                item.STATUS_CSS = "orange";
                break;
              case "Submitted":
                item.STATUS_NAME = "待审核";
                item.STATUS_CSS = "blue";
                break;
              case "Completed":
                item.STATUS_NAME = "完成";
                item.STATUS_CSS = "green";
                break;
              default:
                break;
            }
          })
        })
        return arr;
        // 销售订单及明细11
      case "sales-order":
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              case "Preformed":
                item.STATUS_CSS = "orange";
                item.STATUS_NAME = "预制";
                break;
              case "Submitted":
                item.STATUS_CSS = "blue";
                item.STATUS_NAME = "提交";
                break;
              case "Confirmed":
                item.STATUS_CSS = "blue"; //1115小方说改
                item.STATUS_NAME = "确认";
                break;
              case "Stocking":
                item.STATUS_CSS = "purple";
                item.STATUS_NAME = "备货";
                break;
              case "Distributing":
                item.STATUS_CSS = "yellow";
                item.STATUS_NAME = "配送";
                break;
              case "Completed":
                item.STATUS_CSS = "green";
                item.STATUS_NAME = "完成";
                break;
              default:
                break;
            }
          })
          return arr;
        } else {
          var item = arr[0];

          switch (item.STATUS_VALUE) {
            case "Preformed":
              item.STATUS_CSS = "orange";
              item.STATUS_NAME = "预制";
              break;
            case "Submitted":
              item.STATUS_CSS = "blue";
              item.STATUS_NAME = "提交";
              break;
            case "Confirmed":
              item.STATUS_CSS = "blue"; //1115小方说改
              item.STATUS_NAME = "确认";
              break;
            case "Stocking":
              item.STATUS_CSS = "purple";
              item.STATUS_NAME = "备货";
              break;
            case "Distributing":
              item.STATUS_CSS = "yellow";
              item.STATUS_NAME = "配送";
              break;
            case "Completed":
              item.STATUS_CSS = "green";
              item.STATUS_NAME = "完成";
              break;
            default:
              break;
          }
          return arr;
        }
        // 采购任务11
      case "purchase-task":
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              case "PendPurchase":
                item.STATUS_CSS = "orange";
                break;
              case "Executed":
                item.STATUS_CSS = "blue";
                item.STATUS_NAME = "执行";
                break;
              case "Completed":
                item.STATUS_CSS = "green";
                item.STATUS_NAME = "完成";
                break;
              default:
                break;
            }
            switch (item.TYPE) {
              case "直采直配":
                item.TYPE_CSS = "green-blue";
                break;
              case "直采入库":
                item.TYPE_CSS = "green-blue";
                break;
              case "库存采购":
                item.TYPE_CSS = "blue";
                break;
              default:
                break;
            }
          })
          return arr;
        } else {
          var item = arr[0];
          switch (item.STATUS_VALUE) {
            case "PendPurchase":
              item.STATUS_CSS = "orange";
              break;
            case "Executed":
              item.STATUS_CSS = "blue";
              item.STATUS_NAME = "执行";
              break;
            case "Completed":
              item.STATUS_CSS = "green";
              item.STATUS_NAME = "完成";
              break;
            default:
              break;
          }
          return arr;
        }
        // 采购进货11
      case "purchase-stock":
        //   { Key: "Preformed", Value: '预制' },
        // { Key: "WaitingForPurchase", Value: '待采购' },
        // { Key: "WaitingForInventory", Value: '待入库' },
        // { Key: "AlreadyInventory", Value: '已入库' },
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              case "Preformed":
                item.STATUS_CSS = "orange";
                break;
              case "WaitingForPurchase":
                item.STATUS_CSS = "orange";
                break;
              case "WaitingForInventory":
                item.STATUS_CSS = "blue";
                break;
              case "Executed":
                item.STATUS_CSS = "blue";
                item.STATUS_NAME = "执行";
                break;
              case "AlreadyInventory":
                item.STATUS_CSS = "green";
                break;
              default:
                break;
            }
          })
          return arr;
        } else {
          var item = arr[0];
          switch (item.STATUS_VALUE) {
            case "Preformed":
              item.STATUS_CSS = "orange";
              break;
            case "WaitingForPurchase":
              item.STATUS_CSS = "orange";
              break;
            case "WaitingForInventory":
              item.STATUS_CSS = "blue";
              break;
            case "Executed":
              item.STATUS_CSS = "blue";
              item.STATUS_NAME = "执行";
              break;
            case "AlreadyInventory":
              item.STATUS_CSS = "green";
              break;
            default:
              break;
          }
          return arr;
        }
        //入库任务11
      case "inbound-task":
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              // Preformed/预制 Submitted/预制计划执行完成 Completed
              case "Preformed":
                item.STATUS_NAME = "预制";
                item.STATUS_CSS = "orange";
                break;
              case "Plan":
                item.STATUS_NAME = "计划";
                item.STATUS_CSS = "orange";
                break;
              case "Executed":
                item.STATUS_NAME = "执行";
                item.STATUS_CSS = "blue";
                break;
              case "Completed":
                item.STATUS_NAME = "完成";
                item.STATUS_CSS = "green";
                break;
              default:
                break;
            }
            switch (item.TYPE) {
              // 虚拟入库
              case "采购入库":
                item.TYPE_CSS = "green-blue";
                break;
              case "调拨入库":
                item.TYPE_CSS = "blue";
                break;
              case "退货入库":
                item.TYPE_CSS = "blue";
                break;
              case "其他入库":
                item.TYPE_CSS = "green-blue";
                break;
              default:
                break;
            }
          })
          return arr;
        } else {
          var item = arr[0];
          switch (item.STATUS_VALUE) {
            case "Preformed":
              item.STATUS_NAME = "预制";
              item.STATUS_CSS = "orange";
              break;
            case "Plan":
              item.STATUS_NAME = "计划";
              item.STATUS_CSS = "orange";
              break;
            case "Executed":
              item.STATUS_NAME = "执行";
              item.STATUS_CSS = "blue";
              break;
            case "Completed":
              item.STATUS_NAME = "完成";
              item.STATUS_CSS = "green";
              break;
            default:
              break;
          }
          return arr;
        }
        //分拣任务11
      case "sorting-task":
        arr.map(item => {
          switch (item.STATUS_VALUE) {
            case "Sorting":
              item.STATUS_NAME = "执行";
              item.STATUS_CSS = "blue";
              break;
            default:
              break;
          }
        })
        return arr;
        //分拣领料11
      case "sort-picking":
        arr.map(item => {
          switch (item.STATUS_VALUE) {
            case "Sorting":
              item.STATUS_NAME = "执行";
              item.STATUS_CSS = "blue";
              break;
            default:
              break;
          }
        })
        return arr;
        //出库任务11
      case "outbound-task":
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              case "Preformed":
                item.STATUS_NAME = "预制";
                item.STATUS_CSS = "orange";
                break;
              case "Plan":
                item.STATUS_NAME = "计划";
                item.STATUS_CSS = "orange";
                break;
              case "Executed":
                item.STATUS_NAME = "执行";
                item.STATUS_CSS = "blue";
                break;
              case "Completed":
                item.STATUS_NAME = "完成";
                item.STATUS_CSS = "green";
                break;
              default:
                break;
            }
            switch (item.TYPE) {
              // 虚拟出库
              case "销售出库":
                item.TYPE_CSS = "green-blue";
                break;
              case "采购退货":
                item.TYPE_CSS = "blue";
                break;
              case "调拨出库":
                item.TYPE_CSS = "blue";
                break;
              case "其他出库":
                item.TYPE_CSS = "green-blue";
                break;
              default:
                break;
            }
          })
          return arr;
        } else {
          var item = arr[0];
          switch (item.STATUS_VALUE) {
            case "Preformed":
              item.STATUS_NAME = "预制";
              item.STATUS_CSS = "orange";
              break;
            case "Plan":
              item.STATUS_NAME = "计划";
              item.STATUS_CSS = "orange";
              break;
            case "Executed":
              item.STATUS_NAME = "执行";
              item.STATUS_CSS = "blue";
              break;
            case "Completed":
              item.STATUS_NAME = "完成";
              item.STATUS_CSS = "green";
              break;
            default:
              break;
          }
          return arr;
        }
        //库存盘点11
      case "inventory-verification":
        arr.map(item => {
          switch (item.STATUS_VALUE) {
            case "Executed":
              item.STATUS_NAME = "执行";
              item.STATUS_CSS = "blue";
              break;
            case "InBalance":
              item.STATUS_NAME = "盘差";
              item.STATUS_CSS = "blue";
              break;
            case "Statistic":
              item.STATUS_NAME = "已统计";
              item.STATUS_CSS = "orange";
              break;
            case "Submitted":
              item.STATUS_NAME = "已提交";
              item.STATUS_CSS = "yellow";
              break;
            case "Confirmed":
              item.STATUS_NAME = "已确认";
              item.STATUS_CSS = "purple";
              break;
            case "Completed":
              item.STATUS_NAME = "完成";
              item.STATUS_CSS = "green";
              break;
            default:
              break;
          }
        })
        return arr;
        //配送11
      case "distribution-task":
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              case "PendReceive":
                item.STATUS_NAME = "待领取";
                item.STATUS_CSS = "orange";
                break;
              case "PendLoading":
                item.STATUS_NAME = "待装车";
                item.STATUS_CSS = "blue";
                break;
              case "PendTake":
                item.STATUS_NAME = "待提货";
                item.STATUS_CSS = "yellow";
                break;
              case "PendDistribution":
                item.STATUS_NAME = "待配送";
                item.STATUS_CSS = "yellow";
                break;
              case "InDistribution":
                item.STATUS_NAME = "配送中";
                item.STATUS_CSS = "purple";
                break;
              case "Completed":
                item.STATUS_NAME = "已完成";
                item.STATUS_CSS = "green";
                break;
              default:
                break;
            }
            switch (item.TYPE) {
              // 虚拟出库
              case "订单配送":
                item.TYPE_CSS = "blue";
                break;
              case "采购配送":
                item.TYPE_CSS = "green-blue";
                break;
              case "调拨配送":
                item.TYPE_CSS = "green-blue";
                break;
              default:
                item.TYPE = '订单配送'
                item.TYPE_CSS = "blue";
                break;
            }
          })
          return arr;
        } else {
          var item = arr[0];
          switch (item.STATUS_VALUE) {
            case "PendReceive":
              item.STATUS_NAME = "待领取";
              item.STATUS_CSS = "orange";
              break;
            case "PendLoading":
              item.STATUS_NAME = "待装车";
              item.STATUS_CSS = "blue";
              break;
            case "PendTake":
              item.STATUS_NAME = "待提货";
              item.STATUS_CSS = "yellow";
              break;
            case "PendDistribution":
              item.STATUS_NAME = "待配送";
              item.STATUS_CSS = "yellow";
              break;
            case "InDistribution":
              item.STATUS_NAME = "配送中";
              item.STATUS_CSS = "purple";
              break;
            case "Completed":
              item.STATUS_NAME = "完成";
              item.STATUS_CSS = "green";
              break;
            default:
              break;
          }
          switch (item.TYPE) {
            // 虚拟出库
            case "订单配送":
              item.TYPE_CSS = "blue";
              break;
            case "采购配送":
              item.TYPE_CSS = "green-blue";
              break;
            case "调拨配送":
              item.TYPE_CSS = "green-blue";
              break;
            default:
              break;
          }
          return arr;
        }

        //电子回单
      case "exception-record":
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              case "InDistribution":
                item.STATUS_NAME = "执行";
                item.STATUS_CSS = "blue";
                break;
              case "Completed":
                item.STATUS_NAME = "完成";
                item.STATUS_CSS = "green";
                break;
              default:
                break;
            }
          })
          return arr;
        } else {
          var item = arr[0];
          switch (item.STATUS_VALUE) {
            case "InDistribution":
              item.STATUS_NAME = "执行";
              item.STATUS_CSS = "blue";
              break;
            case "Completed":
              item.STATUS_NAME = "完成";
              item.STATUS_CSS = "green";
              break;
            default:
              break;
          }
          return arr;
        }
      case "inventory-check":
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              case "Preformed":
                item.STATUS_CSS = "orange";
                item.STATUS_NAME = "预制";
                break;

              case "Completed":
                item.STATUS_CSS = "green";
                item.STATUS_NAME = "已完成";
                break;
              default:
                break;
            }

          })
          return arr;
        } else {
          var item = arr[0];
          switch (item.STATUS_VALUE) {
            case "Preformed":
              item.STATUS_CSS = "orange";
              item.STATUS_NAME = "预制";
              break;

            case "Completed":
              item.STATUS_CSS = "green";
              item.STATUS_NAME = "已完成";
              break;
            default:
              break;
          }

          return arr;
        }
      case "allocating-goods":
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              case "Preformed":
                item.STATUS_CSS = "orange";
                item.STATUS_NAME = "预制";
                break;

              case "Completed":
                item.STATUS_CSS = "green";
                item.STATUS_NAME = "已完成";
                break;
              default:
                break;
            }
            switch (item.TYPE) {
              case "退货":
                item.TYPE_CSS = "green-blue";
                break;
              case "要货":
                item.TYPE_CSS = "blue";
                break;
              default:
                break;
            }
          })
          return arr;
        } else {
          var item = arr[0];
          switch (item.STATUS_VALUE) {
            case "Preformed":
              item.STATUS_CSS = "orange";
              item.STATUS_NAME = "预制";
              break;

            case "Completed":
              item.STATUS_CSS = "green";
              item.STATUS_NAME = "已完成";
              break;
            default:
              break;
          }
          switch (item.TYPE) {
            case "退货":
              item.TYPE_CSS = "green-blue";
              break;
            case "要货":
              item.TYPE_CSS = "blue";
              break;
            default:
              break;
          }
          return arr;
        }

      case "retail-order":
      case "retail-dis":
        if (convertType == 'all') {
          arr.map(item => {
            switch (item.STATUS_VALUE) {
              case "Preformed":
                {
                  item.STATUS_ICON = 'perform';
                  item.STATUS_COLOR = '#FFC73E';
                  break;
                };
              case "Pending":
                {
                  item.STATUS_ICON = 'cart-a';
                  item.STATUS_COLOR = '#FFC73E';
                  break;
                };
              case "Confirmed":
                {
                  item.STATUS_ICON = 'cart-a';
                  item.STATUS_COLOR = '#FFC73E';
                  break;
                };
              case "Stocking":
                {
                  item.STATUS_ICON = 'cart-a';
                  item.STATUS_COLOR = '#FFC73E';
                  break;
                };

              case "Distributing":
                {
                  item.STATUS_ICON = 'distributing';
                  item.STATUS_COLOR = '#FFC73E';
                  break;
                };
              case "Completed":
                {
                  item.STATUS_ICON = 'completed';
                  item.STATUS_COLOR = '#89C997';
                  break;
                };
              case "Canceled":
                {
                  item.STATUS_ICON = 'cancel';
                  item.STATUS_COLOR = '#C43432';
                  // 
                  break;
                };
              default:
                break;
            }

            switch (item.PAYMENT_STATUS) { //89C997 lv//C43432//FFC73E
              case "WaitingForPay":
              case "Paying":
                {
                  item.PAYMENT_STATUS_ICON = 'price';
                  item.PAYMENT_STATUS_COLOR = '#FFC73E';
                  break;
                };
              case "AlreadyPay":
                {
                  item.PAYMENT_STATUS_ICON = 'price';
                  item.PAYMENT_STATUS_COLOR = '#89C997';
                  // 
                  break;
                };
              case "Refunding":
                {
                  item.PAYMENT_STATUS_ICON = 'refunding';
                  item.PAYMENT_STATUS_COLOR = '#FFC73E';
                  break;
                };
              case "AlreadyRefund":
                {
                  item.PAYMENT_STATUS_ICON = 'refunding';
                  item.PAYMENT_STATUS_COLOR = '#89C997';
                  break;
                };
              case "AlreadyCancel":
                {
                  item.PAYMENT_STATUS_ICON = 'cancel';
                  item.PAYMENT_STATUS_COLOR = '#C43432';
                  break;
                };
              default:
                break;
            }
          })
          return arr;
        } else {
          var item = arr[0];
          switch (item.STATUS_VALUE) {
            case "Preformed":
              {
                item.STATUS_ICON = 'perform';
                item.STATUS_COLOR = '#FFC73E';
                break;
              };
            case "Pending":
              {
                item.STATUS_ICON = 'cart-a';
                item.STATUS_COLOR = '#FFC73E';
                break;
              };
            case "Confirmed":
              {
                item.STATUS_ICON = 'cart-a';
                item.STATUS_COLOR = '#FFC73E';
                break;
              };
            case "Stocking":
              {
                item.STATUS_ICON = 'cart-a';
                item.STATUS_COLOR = '#FFC73E';
                break;
              };
            case "Distributing":
              {
                item.STATUS_ICON = 'distributing';
                item.STATUS_COLOR = '#FFC73E';
                break;
              };
            case "Completed":
              {
                item.STATUS_ICON = 'completed';
                item.STATUS_COLOR = '#89C997';
                break;
              };
            case "Canceled":
              {
                item.STATUS_ICON = 'cancel';
                item.STATUS_COLOR = '#C43432';
                // 
                break;
              };
            default:
              break;
          }

          switch (item.PAYMENT_STATUS) { //89C997 lv//C43432//FFC73E
            case "WaitingForPay":
            case "Paying":
              {
                item.PAYMENT_STATUS_ICON = 'price';
                item.PAYMENT_STATUS_COLOR = '#FFC73E';
                break;
              };
            case "AlreadyPay":
              {
                item.PAYMENT_STATUS_ICON = 'price';
                item.PAYMENT_STATUS_COLOR = '#89C997';
                // 
                break;
              };
            case "Refunding":
              {
                item.PAYMENT_STATUS_ICON = 'refunding';
                item.PAYMENT_STATUS_COLOR = '#FFC73E';
                break;
              };
            case "AlreadyRefund":
              {
                item.PAYMENT_STATUS_ICON = 'refunding';
                item.PAYMENT_STATUS_COLOR = '#89C997';
                break;
              };
            case "AlreadyCancel":
              {
                item.PAYMENT_STATUS_ICON = 'cancel';
                item.PAYMENT_STATUS_COLOR = '#C43432';
                break;
              };
            default:
              break;
          }

          return arr;
        }
      default:
        break;
    }

  }

}


const converter = {
  //return '5'
  getPackageNumDiffStr: function(num1, num2, unit, packageCoefficient, packageUnit = '') {
    //包装数量
    var num3 = mathEquation.mul(num2, -1)

    var diff = mathEquation.add(num1, num3)

    return {
      diffNumStr: converter.getShowPackageStr(diff, unit, 0, packageUnit),
      diffPackageNumStr: converter.getShowPackageStr(diff, unit, packageCoefficient, packageUnit),
      diff: diff
    }
  },

  getTotalPrice: function(price, packagePrice, num, packageCoefficient) {
    if (Number(num) == 0) {
      return {
        totalPrice: 0
      }
    } else {
      var isNegative = false;
      if (packageCoefficient != 0) {
        //包装数量
        if (Number(num) < 0) {
          //数量小于0
          num = mathEquation.mul(num, -1)
          isNegative = true;
        } else if (Number(num) > 0) {
          //数量大于0
          isNegative = false;
        }
        var orderPackageNum1 = Math.floor(num / packageCoefficient);
        var orderPackageNum2 = num % packageCoefficient; //散装数量
        var price1 = mathEquation.mul(orderPackageNum1, packagePrice);
        var price2 = mathEquation.mul(orderPackageNum2, price);
        var showTotalPrice = mathEquation.add(price1, price2);

        if (Number(showTotalPrice) == 0) {
          return {
            totalPrice: 0
          }
        } else {
          return {
            totalPrice: `${isNegative == true ? '- ' : ''}${showTotalPrice}`
          }
        }
      } else {
        var showTotalPrice = mathEquation.mul(num, price);
        return {
          totalPrice: showTotalPrice
        }
      }
    }
  },

  getPackageNum: function(num, packageCoefficient) {
    //包装数量
    var packageNum1 = Math.floor(num / packageCoefficient);
    var packageNum2 = num % packageCoefficient; //散装数量
    return {
      packageNum1: packageNum1,
      packageNum2: packageNum2
    }
  },


  getPackageTotalNumStr: function(packageNum1, packageNum2, packageCoefficient) {
    //包装数量
    var num1 = mathEquation.mul(packageNum1, packageCoefficient)
    var num = mathEquation.add(num1, packageNum2)
    return `${num}`
  },


  //return '1箱 2斤:5斤'
  getShowPackageStr: function(num, unit, packageCoefficient, packageUnit = '') {

    var isNegative = false;
    if (Number(num) == 0) {
      if (packageCoefficient != 0) {
        return `0${packageUnit} 0${unit}`
      } else {
        return `0${unit}`
      }
    } else if (Number(num) < 0) {
      num = mathEquation.mul(num, -1)
      isNegative = true;
    } else if (Number(num) > 0) {
      isNegative = false;
    }
    if (packageCoefficient != 0) {
      //包装数量
      var packageNum1 = Math.floor(num / packageCoefficient);
      var packageNum2 = num % packageCoefficient; //散装数量
      return `${isNegative == true ? '- ' : ''}${packageNum1}${packageUnit} ${packageNum2}${unit}`
    } else {
      return `${isNegative == true ? '- ' : ''}${Number(num)}${unit}`
    }


  },
  toRound2: function(value) {
    if (value == '' || value == NaN || value == undefined) {
      return '0.00';
    } else {
      var v3 = value.toString();;
      var v4 = Math.round(value * 100) / 100;
      return converter.toFixed2(v4)
    }
  },
  toMoney: function(value) {
    if (value == '' || value == NaN || value == undefined) {
      return '¥0.00'
    } else {
      value = (value + '').replace('¥', '').replace(',', '');

      var valueStr = value.toString();
      var index = valueStr.indexOf(".");
      var len = valueStr.length;

      var num = index > 0 ? valueStr.substring(0, index) : valueStr;
      var cents = index > 0 ? valueStr.substring(index + 1, len) : '00';
      if (cents != undefined) {
        cents = cents.substring(0, 2);
        if (cents.length == 1) {
          cents = cents + '0';
        }
      } else {
        cents = '00';
      }


      if (num.length > 4) {

      }
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
      }
      return '¥' + num + '.' + cents;
    }
  },
  decimalPointToPercentSign: function(value) {
    var percent = Math.round(value * 100);
    return percent + '%';
  },
  toFixed2: function(value) {
    if (value == '' || value == NaN || value == undefined) {
      return '0.00';
    } else {
      var v3 = value.toString();;
      if (v3.split('.')[1] != undefined) {
        if (v3.split('.')[1].length == 1) {
          v3 = v3 + '0';
        }
      } else {
        v3 = v3 + '.00';
      }
      return v3;
    }
  },
  nullToEmpty: function(str) {
    return str == null ? '' : str;
  },
}

const validators = {
  /**
   * 是否不是空字段 返回true
   * @param {需要校验的值} value 
   * @param {值的中文名称/自定义提示} name 
   * @param {是否显示提示(true显示/u-d用户自定义提示/false不显示} showToast 
   */
  isEmptyText: function(value, name, showToast = true) {
    value = value == undefined ? '' : value.toString();

    if (value == null || value.trim() == '') {
      if (showToast == 'u-d') {
        // user-defined
        wx.showToast({
          title: name,
          icon: 'none',
          duration: 3000
        })
      } else if (showToast) {
        // true
        wx.showToast({
          title: name + '不能为空',
          icon: 'none',
          duration: 3000
        })
      }

      return true;
    } else {
      return false;
    }
  },

  // isNumOrEmpty 是非有效数字且不为空
  isNotNumAndEmpty: function(value, name, showToast = true) {
    if (validators.isEmptyText(value, '', false) || !validators.isNotDecimals(value, '', false)) {
      //为空或有效数字
      return false;
    } else {
      if (showToast == 'u-d') {
        // user-defined
        wx.showToast({
          title: name,
          icon: 'none',
          duration: 3000
        })
      } else if (showToast) {
        // true
        wx.showToast({
          title: name + '非有效数字',
          icon: 'none',
          duration: 3000
        })
      }
      return true;
    }
  },

  isPhoneNumber: function(value, name, showToast = true) {
    value = value == undefined ? '' : value.toString();
    if ((value != null && value.trim() != '') && value.trim().length != 11) {
      if (showToast == 'u-d') {
        // user-defined
        wx.showToast({
          title: name,
          icon: 'none',
          duration: 3000
        })
      } else if (showToast) {
        // true
        wx.showToast({
          title: name + '长度不是11位',
          icon: 'none',
          duration: 3000
        })
      }
      return true;
    } else {
      return false;
    }
  },
  /**
   * 是否不是非零非空数字 返回true
   * @param {需要校验的值} value 
   * @param {值的中文名称/自定义提示} name 
   * @param {是否显示提示(true显示/u-d用户自定义提示/false不显示} showToast 
   */
  isInValidNum: function(value, name, showToast = true) {
    const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
    value = value == undefined ? '' : value.toString();
    if (!reg.test(value) || (value == null || value.trim() == '')) {
      if (showToast == 'u-d') {
        // user-defined
        wx.showToast({
          title: name,
          icon: 'none',
          duration: 3000
        })
      } else if (showToast) {
        // true
        wx.showToast({
          // 必须为数字
          title: name + '输入内容有误',
          icon: 'none',
          duration: 3000
        })
      }
      return true;
    } else {
      return false;
    }
  },

  /**
   * 是否不是两位小数校验 返回true
   * @param {*} value 
   * @param {*} name 
   * @param {*} showToast 
   */
  isNotDecimals: function(value, name, showToast = true) {
    // const reg = /^-?\d+\.?\d{0,2}$/;
    value = value == undefined ? '' : value.toString();

    const reg = /(^[0-9]+$)|(^[0-9]+[\.]{1}[0-9]{1,2}$)/;

    if (!reg.test(value) || (value.trim() == '' || value == null)) {
      if (showToast == 'u-d') {
        // user-defined
        wx.showToast({
          title: name,
          icon: 'none',
          duration: 3000
        })
      } else if (showToast) {
        // true
        wx.showToast({
          // 最多输入两位小数
          title: name + '输入内容有误',
          icon: 'none',
          duration: 3000
        })
      }
      return true;
    } else {
      return false;
    }
  },

  /**
   * 是否不是两位小数校验 返回true
   * @param {*} value 
   * @param {*} name 
   * @param {*} showToast 
   */
  isNotDecimalsWithOutZero: function(value, name, showToast = true) {
    const reg = /(^[0-9]+$)|(^[0-9]+[\.]{1}[0-9]{1,2}$)/;
    value = value == undefined ? '' : value.toString();

    value = value.toString();
    if (!reg.test(value) || (value.trim() == '' || value == null) || Number.parseFloat(value) == 0) {
      if (showToast == 'u-d') {
        // user-defined
        wx.showToast({
          title: name,
          icon: 'none',
          duration: 3000
        })
      } else if (showToast) {
        // true
        wx.showToast({
          // 最多输入两位小数且不能为0
          title: name + '输入内容有误',
          icon: 'none',
          duration: 3000
        })
      }
      return true;
    } else {
      return false;
    }
  },

  isIntWithOutZero: function(value, name, showToast = true) {
    const reg = /^[0-9]+$/;
    value = value == undefined ? '' : value.toString();
    if (!reg.test(value) || (value.trim() == '' || value == null || value == undefined) || Number.parseFloat(value) == 0) {
      if (showToast == 'u-d') {
        // user-defined
        wx.showToast({
          title: name,
          icon: 'none',
          duration: 3000
        })
      } else if (showToast) {
        // true
        wx.showToast({
          // 最多输入两位小数且不能为0
          title: name + '非有效数字',
          icon: 'none',
          duration: 3000
        })
      }
      return true;
    } else {
      return false;
    }
  },

  /**
   * 是否不是仅数字加字母 返回true
   * @param {*} value 
   * @param {*} name 
   * @param {*} showToast 
   */
  isNotAlphanumeric: function(value, name, showToast = true) {
    const reg = /^[A-Za-z0-9]+$/;
    value = value == undefined ? '' : value.toString();
    if (!reg.test(value) || (value.trim() == '' || value == null || value == undefined)) {
      if (showToast == 'u-d') {
        // user-defined
        wx.showToast({
          title: name,
          icon: 'none',
          duration: 3000
        })
      } else if (showToast) {
        // true
        wx.showToast({
          // 仅支持数字加字母
          title: name + '输入内容有误',
          icon: 'none',
          duration: 3000
        })
      }

      return true;
    } else {
      return false;
    }
  },
}



module.exports = {
  time: time,
  mathEquation: mathEquation,
  converter: converter,
  validators: validators,
  arrayProcessing: arrayProcessing,
}




// 验证数字的正则表达式集 
// 验证数字：^[0-9]*$ 
// 验证n位的数字：^\d{n}$ 
// 验证至少n位数字：^\d{n,}$ 
// 验证m-n位的数字：^\d{m,n}$ 
// 验证零和非零开头的数字：^(0|[1-9][0-9]*)$ 
// 验证有两位小数的正实数：^[0-9]+(.[0-9]{2})?$ 
// 验证有1-3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$ 
// 验证非零的正整数：^\+?[1-9][0-9]*$ 
// 验证非零的负整数：^\-[1-9][0-9]*$ 
// 验证非负整数（正整数 + 0） ^\d+$ 
// 验证非正整数（负整数 + 0） ^((-\d+)|(0+))$ 
// 验证长度为3的字符：^.{3}$ 
// 验证由26个英文字母组成的字符串：^[A-Za-z]+$ 
// 验证由26个大写英文字母组成的字符串：^[A-Z]+$ 
// 验证由26个小写英文字母组成的字符串：^[a-z]+$ 
// 验证由数字和26个英文字母组成的字符串：^[A-Za-z0-9]+$ 
// 验证由数字、26个英文字母或者下划线组成的字符串：^\w+$ 
// 验证用户密码:^[a-zA-Z]\w{5,17}$ 正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。 
// 验证是否含有 ^%&',;=?$\" 等字符：[^%&',;=?$\x22]+ 
// 验证汉字：^[\u4e00-\u9fa5],{0,}$ 
// 验证Email地址：/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
// 验证InternetURL：^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$ 
// 验证电话号码：^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$：--正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX。 
// 验证身份证号（15位或18位数字）：^\d{15}|\d{}18$ 
// 验证一年的12个月：^(0?[1-9]|1[0-2])$ 正确格式为：“01”-“09”和“1”“12” 
// 验证一个月的31天：^((0?[1-9])|((1|2)[0-9])|30|31)$ 正确格式为：01、09和1、31。 
// 整数：^-?\d+$ 
// 非负浮点数（正浮点数 + 0）：^\d+(\.\d+)?$ 
// 正浮点数 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$ 
// 非正浮点数（负浮点数 + 0） ^((-\d+(\.\d+)?)|(0+(\.0+)?))$ 
// 负浮点数 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$ 
// 浮点数 ^(-?\d+)(\.\d+)?$