Component({
  behaviors: ['wx://form-field'],

  externalClasses: ['i-class'],

  properties: {
    title: {
      type: String
    },
    // text || textarea || password || number
    type: {
      type: String,
      value: 'text'
    },
    disabled: {
      type: Boolean,
      value: false
    },
    isdisabled: {
      type: String,
      value: 'false'
    },
    placeholder: {
      type: String,
      value: ''
    },
    autofocus: {
      type: Boolean,
      value: false
    },
    mode: {
      type: String,
      value: 'normal'
    },
    column: {
      type: Boolean,
      value: false
    },
    right: {
      type: Boolean,
      value: false
    },
    error: {
      type: Boolean,
      value: false
    },
    maxlength: {
      type: Number,
      value: 1000
    },
    noline: {
      type: String,
      value: "false"
    },
    name: {
      type: String,
      value: ""
    },
    obj: {
      type: String,
      value: ""
    }
  },

  methods: {
    handleInputChange(event) {
      const {
        detail = {}
      } = event;

      const {
        value = ''
      } = detail;

      this.setData({
        value
      });

      this.triggerEvent('change', event);
    },
    openRemarkPage(e) {
      var that = this;
      var {
        name,
        obj,
        title
      } = that.data;
      var val = that.data.value == null ? '' : that.data.value;

      wx.navigateTo({
        url: `../../../pages/common-page/remark?type=local&value=${val}&updatelocalText=${obj}.${name}&title=${title}`,
      })
    },




    // handleInputFocus(event) {
    //     this.triggerEvent('focus', event);
    // },

    // handleInputBlur(event) {
    //     this.triggerEvent('blur', event);
    // }
  }
});