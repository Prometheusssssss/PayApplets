Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        showDateDetail:  false,
        date1: '',
        date2: '',
        years: [],
        months: [],
        days: [],
        value: [],
        syear: '',
        smonth: '',
        sday: '',
        eyear: '',
        emonth: '',
        eday: '',

    },
    lifetimes: {
        attached() {
            let date = new Date();
            let eyear = date.getFullYear().toString(),
                emonth = (date.getMonth() + 1).toString(),
                eday = date.getDate().toString();
            emonth = emonth.length < 2 ? '0' + emonth : emonth,
                eday = eday.length < 2 ? '0' + eday : eday;
            let years = [],
                months = [],
                days = [];
            for (let i = 2000; i <= eyear; i++) {
                var num = i.toString();
                years.push(num)
            }
            for (let i = 1; i <= 12; i++) {
                var num = i.toString();
                if (num.length < 2) {
                    num = '0' + num;
                }
                months.push(num)
            }
            for (let i = 1; i <= 31; i++) {
                var num = i.toString();
                if (num.length < 2) {
                    num = '0' + num;
                }
                days.push(num)
            }

            let sdate = date;
            sdate.setDate(sdate.getDate() - 31);

            let syear = sdate.getFullYear().toString(),
                smonth = (sdate.getMonth() + 1).toString(),
                sday = sdate.getDate().toString();
            smonth = smonth.length < 2 ? '0' + smonth : smonth,
                sday = sday.length < 2 ? '0' + sday : sday;
            var data1 = {
                years: years,
                months: months,
                days: days,
                syear: syear,
                smonth: smonth,
                sday: sday,
                eyear: eyear,
                emonth: emonth,
                eday: eday,
                status: 'S',
                value: [years.indexOf(syear), months.indexOf(smonth), days.indexOf(sday)],
            };
            this.setData({
                years: years,
                months: months,
                days: days,
                syear: syear,
                smonth: smonth,
                sday: sday,
                eyear: eyear,
                emonth: emonth,
                eday: eday,
            })
            this.changeDateStart();
            let date1 = `${syear}-${smonth}-${sday}`;
            let date2 = `${eyear}-${emonth}-${eday}`;
            this.setData({
                date1: date1,
                date2: date2,
            })
            this.triggerEvent('confirm', {
                date1: date1,
                date2: date2
            });
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        openDateViewPicker: function () {
            this.setData({
                showDateDetail: true,
            })
        },
        changeDateStart: function (e) {
            
            let {
                years,
                months,
                days
            } = this.data;
            let {
                syear,
                smonth,
                sday
            } = this.data;
            this.setData({
                status: 'S',
                value: [years.indexOf(syear), months.indexOf(smonth), days.indexOf(sday)],
            })
        },
        changeDateEnd: function (e) {
            
            let {
                years,
                months,
                days
            } = this.data;
            let {
                eyear,
                emonth,
                eday
            } = this.data;
            this.setData({
                status: 'E',
                value: [years.indexOf(eyear), months.indexOf(emonth), days.indexOf(eday)],

            })
        },
        bindChange: function (e) {
            const val = e.detail.value
            let {
                status
            } = this.data;
            if (status == 'S') {
                this.setData({
                    syear: this.data.years[val[0]],
                    smonth: this.data.months[val[1]],
                    sday: this.data.days[val[2]]
                })
            } else {
                this.setData({
                    eyear: this.data.years[val[0]],
                    emonth: this.data.months[val[1]],
                    eday: this.data.days[val[2]]
                })
            }
        },
        confirmEvent: function (e) {
            let {
                syear,
                smonth,
                sday,
                eyear,
                emonth,
                eday
            } = this.data;
            let date1 = `${syear}-${smonth}-${sday}`;
            let date2 = `${eyear}-${emonth}-${eday}`;
            this.setData({
                date1: date1,
                date2: date2,
                showDateDetail: false,
            })
            this.triggerEvent('confirm', {
                date1: date1,
                date2: date2
            });
        }
    }

    // this.triggerEvent('ChangeDate', acttime);


})