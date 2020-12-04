const app = getApp()
// pages/customerOrder/customerOrder.js
const { common,base64 } = global;
let videoAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalList: [],
    defaultPageSize: app.getPageSize(),
    searchText: '',

  
   recommondCurrentList:[],
   remark:'',

  // 主副武器、项链、戒指、护腕、腰带---攻击型琅纹 天+混
  // 外套、鞋子、手镯、玉佩、帽子、防御--防御性琅纹 地+混
  // 天属于攻击；地属于防御；混属于攻击+防御

  attackList:[{
    NAME : "【天】云",
    URL : "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512182/image",
    COLOR:'紫'
  },{
    NAME : "【天】虹",
    URL : "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512183/image",
    COLOR:'紫'
  },
  // {
  //   NAME : "【天】月",
  //   URL : "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512184/image",
  //   COLOR:'紫'
  // },
  {
    NAME : "【天】雪",
    URL : "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512185/image",
    COLOR:'紫'
  },{
    NAME : "【天】风",
    URL : "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512186/image",
    COLOR:'紫'
  },{
    NAME : "【天】雨",
    URL : "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512187/image",
    COLOR:'紫'
  },
  // {
  //   NAME : "【天】日",
  //   URL : "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512188/image",
  //   COLOR:'紫'
  // },
  {
    NAME: "【天】皇天",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512127/image",
    COLOR:'金'
  },{
    NAME: "【天】辉宸",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512128/image",
    COLOR:'金'
  },{
    NAME: "【天】穹宇",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512129/image",
    COLOR:'金'
  },{
    NAME: "【天】星渊",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512131/image",
    COLOR:'金'
  },{
    NAME: "【天】玄宙",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512132/image",
    COLOR:'金'
  },{
    NAME: "【天】银河",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512133/image",
    COLOR:'金'
  },{
    NAME: "【混】道心",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512122/image",
    COLOR:'金'
  },{
    NAME: "【混】上清",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512123/image",
    COLOR:'紫'
  },{
    NAME: "【混】神人",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512124/image",
    COLOR:'金'
  },{
    NAME: "【混】太清",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512125/image",
    COLOR:'紫'
  },{
    NAME: "【混】玉清",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512126/image",
    COLOR:'紫'
  }],//攻击
  defenseList:[{
    NAME : "【地】金",
    URL : "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512189/image",
    COLOR:'紫'
  },{
    NAME : "【地】木",
    URL : "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512111/image",
    COLOR:'紫'
  },
  // {
  //   NAME: "【地】水",
  //   URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512112/image",
  //   COLOR:'紫'
  // },
  {
    NAME: "【地】土",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512113/image",
    COLOR:'紫'
  },{
    NAME: "【地】泽",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512114/image",
    COLOR:'紫'
  },
  // {
  //   NAME: "【地】山",
  //   URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512115/image",
  //   COLOR:'紫'
  // },
  {
    NAME: "【地】田",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512116/image",
    COLOR:'紫'
  },{
    NAME: "【地】厚土",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512117/image",
    COLOR:'金'
  },{
    NAME: "【地】菊台",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512118/image",
    COLOR:'金'
  },{
    NAME: "【地】梅林",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512119/image",
    COLOR:'金'
  },{
    NAME: "【地】竹川",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512121/image",
    COLOR:'金'
  },{
    NAME: "【混】道心",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512122/image",
    COLOR:'金'
  },{
    NAME: "【混】上清",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512123/image",
    COLOR:'紫'
  },{
    NAME: "【混】神人",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512124/image",
    COLOR:'金'
  },{
    NAME: "【混】太清",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512125/image",
    COLOR:'紫'
  },{
    NAME: "【混】玉清",
    URL: "https://oss.dazuiba.cloud:8003//api/oss/20201024-A9C4DE6A-BF80-41AB-B8BB-9C986C512126/image",
    COLOR:'紫'
  }],//防御
 
  levelList:[1,2,3,4,5,6,7,8,9,10],
  levelIndex:0,
  armsList:[{
    KID:1,
    ARMS_NAME:'主武器',
    BUWEI:'zhuwuqi',
    TYPE: 'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:2,
    ARMS_NAME:'副武器',
    BUWEI:'fuwuqi',
    TYPE: 'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:3,
    ARMS_NAME:'项链',
    BUWEI:'xianglian',
    TYPE:'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    {
      DETAIL_KID:5,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    }
  ]
  },{
    KID: 4,
    ARMS_NAME:'戒指',
    BUWEI:'jiezhi',
    TYPE:'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:5,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    }]
  },{
    KID:5,
    ARMS_NAME:'护腕',
    BUWEI:'huwan',
    TYPE:'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:4,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:6,
    ARMS_NAME:'外套',
    BUWEI:'waitao',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:7,
    ARMS_NAME:'鞋子',
    BUWEI:'xiezi',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:8,
    ARMS_NAME:'手镯',
    BUWEI:'shouzhuo',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:5,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    }]
  },{
    KID:9,
    ARMS_NAME:'玉佩',
    BUWEI:'yupei',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:5,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    }]
  },{
    KID:10,
    ARMS_NAME:'帽子',
    BUWEI:'maozi',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:4,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:11,
    ARMS_NAME:'腰带',
    BUWEI:'yaodai',
    TYPE:'mix',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:3,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:4,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:12,
    ARMS_NAME:'内衬',
    BUWEI:'neicheng',
    TYPE:'mix',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:3,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:4,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  }],
  originalArmsList:[{
    KID:1,
    ARMS_NAME:'主武器',
    BUWEI:'zhuwuqi',
    TYPE: 'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:2,
    ARMS_NAME:'副武器',
    BUWEI:'fuwuqi',
    TYPE: 'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:3,
    ARMS_NAME:'项链',
    BUWEI:'xianglian',
    TYPE:'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    {
      DETAIL_KID:5,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    }
  ]
  },{
    KID: 4,
    ARMS_NAME:'戒指',
    BUWEI:'jiezhi',
    TYPE:'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:5,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    }]
  },{
    KID:5,
    ARMS_NAME:'护腕',
    BUWEI:'huwan',
    TYPE:'attack',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:4,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:6,
    ARMS_NAME:'外套',
    BUWEI:'waitao',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:7,
    ARMS_NAME:'鞋子',
    BUWEI:'xiezi',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:8,
    ARMS_NAME:'手镯',
    BUWEI:'shouzhuo',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:5,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    }]
  },{
    KID:9,
    ARMS_NAME:'玉佩',
    BUWEI:'yupei',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:4,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:5,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    }]
  },{
    KID:10,
    ARMS_NAME:'帽子',
    BUWEI:'maozi',
    TYPE:'defense',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:3,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:4,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:11,
    ARMS_NAME:'腰带',
    BUWEI:'yaodai',
    TYPE:'mix',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:3,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:4,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  },{
    KID:12,
    ARMS_NAME:'内衬',
    BUWEI:'neicheng',
    TYPE:'mix',
    DETAIL:[{
      DETAIL_KID:1,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },{
      DETAIL_KID:2,
      COLOR:'',
      LW_IAMGE:'',
      LW_NAME:'',
      LW_LEVEL: ' '
    },
    // {
    //   DETAIL_KID:3,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:4,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // },{
    //   DETAIL_KID:5,
    //   COLOR:'',
    //   LW_IAMGE:'',
    //   LW_NAME:'',
    //   LW_LEVEL: ' '
    // }
  ]
  }],
  currentLwList:[],
  currentLwIndex:0,
  currentSelectLwDetailKid: 1,
  currentSelectLwName:'',
  pointPrice:450,
  isLogin:true,

  detailStrList: [],
  totalAttr: "",
  totalKeysXiaofei: "",
  totalSkill: 0,

  showLwDetail:false,

  showConfirmAuthorization:false,
  showConfirmLogin:false,

  showPropertyInfo:false,
  showCaculateConfirm:false,
  showClearLwConfirm:false,
  },
  //所有涉及到登录的地方都要返回用户的次数和是否永久可用字段 未做
  // 去增加次数的时候判断是不是系统用户；；；不是的话请先注册，然后才能去支付；；；要提示一旦付款没办法退款  已做待测试
  // 增加次数的时候 通过广告观看并不能无限次调起，因为每个用户每天观看广告量是有限制的  可能有的人就看不了广告  已做待测试
  //限制广告的点击次数  不知道能不能用 怎么一进来去限制掉看广告按钮

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var armsList = wx.getStorageSync('armsList');
    if(armsList != undefined && armsList != ''){
      that.setData({
        armsList: JSON.parse(armsList)
      })
    }
    
  },
  onShow: function () {
    var that = this;
    //取数组值
    var user = app.getUser();
    if(user == undefined || user == null){
      that.setData({isLogin:false})
    }else{
      that.setData({
        userInfo: app.getUser()
      })
    }
    that.refreshVideoAdCount()
  },
  onUnload:function(){
    var that = this;
    var armsList = that.data.armsList;
    armsList.forEach(arm=>{
      arm.PROPERTY = '';
      arm.SKILL = '';
    })
    wx.setStorageSync('armsList', JSON.stringify(armsList))
  },
  loadUserInfo:function(){
    var that = this;
    var p = {"KID": app.getUser().id}
    var url = `/api/_search/defaultSearch/a_user?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
      if (dataList != 'error') {
          var info = {
            id: dataList[0].KID,
            code: dataList[0].CODE,
            name: dataList[0].NAME,
            url: dataList[0].IMG_URL,
            isManager: dataList[0].IS_SA,
            tel: dataList[0].PHONE,
            isPermanent: dataList[0].IS_PERMANENT,
            countNumber: dataList[0].COUNT_NUMBER,
          };
        app.setUser(info)
        that.setData({userInfo: info})
      }
    })
  },
  refreshVideoAdCount:function(){
    // 获取激励视频广告位加载的次数
    var count = wx.getStorageSync('showRewardedVideoAdCount');
    if (!count) {
      wx.setStorageSync('showRewardedVideoAdCount', 0)
    };
    // 上次观看激励视频广告保存的时间
    var lastSaveTime = wx.getStorageSync('saveVideoAdCountTime');
    if (lastSaveTime) {
      // 计算最后一次保存时间晚上12点的时间戳
      var endTime = new Date(new Date(lastSaveTime).setHours(23, 59, 59, 999));
      // 当前时间戳
      var currentDate = new Date();
      var currentTime = currentDate.getTime();
      // 清空激励广告位观看次数
      if (currentTime > endTime) {
        wx.setStorageSync('showRewardedVideoAdCount', 0)
      }
    } 
  },
   // 主副武器、项链、戒指、护腕---攻击型琅纹
  // 外套、鞋子、手镯、玉佩、帽子--防御性琅纹
  // 腰带、内衬--攻防都可
  // 天属于攻击；地属于防御；混属于攻击+防御

  selectLw:function(e){
    var that = this;
    var data = that.data;
    var item = e.currentTarget.dataset.item;
    var detailItem = e.currentTarget.dataset.detail;
    var detailKid = detailItem.DETAIL_KID;
    var detailName = detailItem.LW_NAME;
    var currentLwList = [];
    var name = item.ARMS_NAME;
    var level = item.LW_LEVEL;
    if(name.indexOf('武器') != -1 || name.indexOf('项链') != -1  || 
    name.indexOf('戒指') != -1  || name.indexOf('护腕') != -1 || name.indexOf('腰带') != -1 ){
        currentLwList =  data.attackList;
    }
    if(name.indexOf('外套') != -1 || name.indexOf('鞋子') != -1  || 
      name.indexOf('手镯') != -1  || name.indexOf('玉佩') != -1 || name.indexOf('帽子') != -1 ||  name.indexOf('内衬') != -1){
        currentLwList =  data.defenseList;
    }
    if(detailName == '' || detailName == undefined){
      that.setData({
        currentLwIndex:0,
        levelIndex:0,
      })
    }
    var currentLwIndex = currentLwList.findIndex(lw=>lw.NAME == detailItem.LW_NAME) 
    var levelIndex = that.data.levelList.findIndex(levelItem=>levelItem == detailItem.LW_LEVEL)
    that.setData({
      showLwDetail:true,
      currentSelectLwDetailKid: detailKid,
      currentSelectLwName: name,
      currentLwIndex: currentLwIndex == -1 ? 0: currentLwIndex,
      levelIndex: levelIndex == -1 ? 0: levelIndex,
      currentLwList: currentLwList
    })
  },


  bindLwChange:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      currentLwIndex : value
    })
  },
  bindLevelChange: function (e) {
    var that = this;
    that.setData({
      levelIndex: e.detail.value
    })
  },
  bindPointInput:function(e){
    var that = this;
    that.setData({
      pointPrice: e.detail.value
    })
  },
  confirmSelectLw:function(){
    var that = this;
    var data = that.data;
    // levelIndex,currentLwIndex 拿到等级和当前的是哪个current琅玟  
    var armsList = data.armsList;
    var currentLwList = data.currentLwList;
    var levelList = data.levelList;
    var currentLwIndex = data.currentLwIndex;
    var levelIndex = data.levelIndex;

    var selectLwInfo = currentLwList[currentLwIndex];
    var selectLevelInfo = levelList[levelIndex];
    var currentSelectLwDetailKid= data.currentSelectLwDetailKid;
    var currentSelectLwName= data.currentSelectLwName;
    //再和总的琅玟list比较 更新到页面上
    // COLOR:'',// LW_IAMGE:'',// LW_NAME:'',// LW_LEVEL: 
    armsList.forEach(arm=>{
      if(arm.ARMS_NAME == currentSelectLwName){
        arm.IS_SELECT = true;
        arm.DETAIL.forEach(de=>{
          if(de.DETAIL_KID == currentSelectLwDetailKid){
             de.COLOR = selectLwInfo.COLOR;
             de.LW_IAMGE = selectLwInfo.URL;
             de.LW_NAME = selectLwInfo.NAME;
             de.LW_LEVEL = selectLevelInfo;
          }
        })
      }
    })
    that.setData({
      armsList : armsList,
      showLwDetail:false
    })
  },
  //清空单个琅玟
  clearSelectLw:function(){
    var that = this;
    var data = that.data;
    var armsList = data.armsList;
    var currentSelectLwDetailKid= data.currentSelectLwDetailKid;
    var currentSelectLwName= data.currentSelectLwName;
    if(currentSelectLwName != ''){
      armsList.forEach(arm=>{
        if(arm.ARMS_NAME == currentSelectLwName){
          arm.IS_SELECT = true;
          arm.DETAIL.forEach(de=>{
            if(de.DETAIL_KID == currentSelectLwDetailKid){
               de.COLOR = '';
               de.LW_IAMGE = '';
               de.LW_NAME = '';
               de.LW_LEVEL = ' ';
            }
          })
        }
      })
    }
    
    that.setData({
      armsList : armsList,
      showLwDetail:false
    })
  },
  //  确认计算三次后 触发激励广告 
  saveValue: async function(e){
    var that = this;
    if(!that.data.isLogin){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        duration:2000
      })
    }else{
    //如果次数变成0了，不能弹出弹框 提示请去增加次数
    if(that.data.userInfo.countNumber <= 0 && !that.data.userInfo.isPermanent){
      wx.showToast({
        title: '当前可计算次数已用完，请去增加次数',
        icon:'none',
        duration:2000
      })
      return
    }
      that.setData({showCaculateConfirm:true})
    }
   
  },
  confirmCaculateLw: async function(){
    var that = this;
    var data = that.data;
    var armsList = data.armsList;
    //确认计算之前要校验下这个用户是不是没有登陆过 没有登陆不允许计算
    var armsInfo = await that.getArmsInfo(armsList)
    var p = {
      "userId": app.getUser().id,
      "keyPrice": data.pointPrice,
      "zhuwuqi": armsInfo.zhuwuqi,
      "fuwuqi":armsInfo.fuwuqi,
      "xianglian":armsInfo.xianglian,
      "jiezhi":armsInfo.jiezhi,
      "huwan":armsInfo.huwan,
      "waitao":armsInfo.waitao,
      "xiezi":armsInfo.xiezi,
      "shouzhuo":armsInfo.shouzhuo,
      "yupei":armsInfo.yupei,
      "maozi":armsInfo.maozi,
      "yaodai":armsInfo.yaodai,
      "neicheng": armsInfo.neicheng
    }
    app.ManageExecuteApi('/api/_langwen/langwenResonance', '', p, 'POST').then((dataList) => {
      that.setData({showCaculateConfirm:false})
      if (dataList != 'error') {
        wx.showToast({
          title: '计算成功',
          icon:'none',
          duration:1500
        })
        var detailList = dataList.detailList;
        detailList.forEach(de=>{
          armsList.forEach(arm=>{
            if(de.buwei == arm.BUWEI){
              arm.PROPERTY = de.attrStr;
              arm.SKILL = de.skill
            }
          })
        })
        //拉取最新的用户信息
        that.updateLoadUser()
        that.setData({
          armsList:armsList,
          showPropertyInfo:true,
          detailStrList: JSON.parse(dataList.detailStr),
          totalAttr:{
            "firstStr": dataList.firstStr,
            "sencondStr": dataList.sencondStr,
            "threeStr": dataList.threeStr,
            "foreStr": dataList.foreStr,
            "fiveStr": dataList.fiveStr,  
          },
          totalKeysXiaofei:dataList.totalKeysXiaofei,
          totalSkill:dataList.totalSkill
        })
      }
    })
  },
  updateLoadUser:function(){
    var that = this;
    var p = {"KID": app.getUser().id}
    var url = `/api/_search/defaultSearch/a_user?filter=${JSON.stringify(p)}`;
    app.ManageExecuteApi(url, '', {}, 'GET').then((dataList) => {
      if (dataList != 'error') {
          var info = {
            id: dataList[0].KID,
            code: dataList[0].CODE,
            name: dataList[0].NAME,
            url: dataList[0].IMG_URL,
            isManager: dataList[0].IS_SA,
            tel: dataList[0].PHONE,
            isPermanent: dataList[0].IS_PERMANENT,
            countNumber: dataList[0].COUNT_NUMBER,
          };
        app.setUser(info)
        that.setData({userInfo: info})
      }
    })
  },
  getArmsInfo: async function(armsList){
    var zhuwuqi = '',fuwuqi='',xianglian='',jiezhi='',huwan='',
        waitao='',xiezi='',shouzhuo='',yupei='',maozi='',yaodai='',
        neicheng='';
    var list = armsList;
    // 【天】云_5_紫
    list.forEach(item=>{
      if(item.BUWEI == 'zhuwuqi'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            zhuwuqi += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'fuwuqi'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            fuwuqi += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'xianglian'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            xianglian += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'jiezhi'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            jiezhi += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'huwan'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            huwan += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'waitao'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            waitao += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'xiezi'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            xiezi += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'shouzhuo'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            shouzhuo += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'yupei'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            yupei += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'maozi'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            maozi += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'yaodai'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            yaodai += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
      if(item.BUWEI == 'neicheng'){
        //明细必须有值才拼接
        item.DETAIL.forEach(de=>{
          if(de.LW_NAME!=''){
            neicheng += de.LW_NAME+'_'+de.LW_LEVEL+'_'+de.COLOR +','
          }
        })
      }
    })
    var armsInfo = {
      zhuwuqi : zhuwuqi.substring(0,zhuwuqi.length-1),
      fuwuqi : fuwuqi.substring(0,fuwuqi.length-1),
      xianglian : xianglian.substring(0,xianglian.length-1),
      jiezhi : jiezhi.substring(0,jiezhi.length-1),
      huwan : huwan.substring(0,huwan.length-1),
      waitao : waitao.substring(0,waitao.length-1),
      xiezi : xiezi.substring(0,xiezi.length-1),
      shouzhuo : shouzhuo.substring(0,shouzhuo.length-1),
      yupei : yupei.substring(0,yupei.length-1),
      maozi : maozi.substring(0,maozi.length-1),
      yaodai : yaodai.substring(0,yaodai.length-1),
      neicheng : neicheng.substring(0,neicheng.length-1),
    }
    return armsInfo
  },
  goLogin:function(){
    var that = this;
    that.setData({showConfirmLogin:true})
  },
  addTimes:function(){
    var that = this;
    var userInfo = that.data.userInfo;
    console.log('增加次数')
    console.log(userInfo)
    if(userInfo == undefined || userInfo == null  || userInfo == ''){
      that.setData({showConfirmLogin:true})
    }else{
      wx.navigateTo({
        url: `langwen-add-times`,
      })
    }
  },

  //第一次授权
  getPhoneNumber:async function(res) {
    var that = this;
    if (res.detail.errMsg == 'getPhoneNumber:ok') {
      //用户按了允许授权按钮
      var data = res.detail;
      var encryptedData = data.encryptedData;
      var iv = data.iv;
      var code = await app.getJsCode();
      var p = {
        "jsCode": code,
        "name": base64.encode(that.data.userInfo.name),
        "url": that.data.userInfo.url,
        "encryptedData": encryptedData,
        "iv": iv,
      }
      await app.ManageExecuteApi(`/api/_login/doLogin`, '', p, "POST").then((result) => {
        if(result != 'error'){//存入user  跳转页面
          var data = result[0];
          var info = {
            id: data.KID,
            code: data.CODE,
            name: data.NAME,
            url: data.IMG_URL,
            isManager: data.IS_SA,
            tel: data.PHONE,
            isPermanent: data.IS_PERMANENT,
            countNumber: data.COUNT_NUMBER,
          };
          app.setUser(info)
          that.setData({
            userInfo: info,
            showConfirmAuthorization:false,
            isLogin:true,
          })
          wx.showToast({
            title: '注册成功',
            icon:'none',
            duration:1500
          })
        }else{
          //重新授权登录
          that.setData({
              showConfirmAuthorization:false,
              isLogin:false
          })
          wx.showToast({
            title: '注册失败',
            icon:'none',
            duration:1500
          })
        }
      })
    } else {
      wx.showToast({
        title: '注册解锁更多功能哦~',
        icon:'none',
        duration:1500
      })
    }
 },
  getUserInfo: async function(res){
    var that = this;
    if (res.detail.errMsg == 'getUserInfo:ok') {
        //用户按了允许授权按钮
        var data = JSON.parse(res.detail.rawData);
        var nickName = data.nickName;
        var name = nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "") ;
        var userInfo = {
          name: name,
          url: data.avatarUrl
        }
        that.setData({
          userInfo:userInfo,
          showConfirmLogin:false,
          showConfirmAuthorization:true
        })
      } else {
        //用户按了拒绝按钮
        that.setData({
          showConfirmLogin:false,
        })
      }
  },
  cancelDoLogin:function(){
    var that = this;
    that.setData({showConfirmLogin:false})
  },
  cancel:function(){
    var that = this;
    that.setData({showConfirmAuthorization:false})
  },
  clearAllLw:function(){
    var that = this;
    that.setData({
      showClearLwConfirm:true
    })
  },
  confirmClearLw:function(){
    var that = this;
    that.setData({
      armsList : that.data.originalArmsList,
      showClearLwConfirm:false
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "分享琅纹推荐", // 默认是小程序的名称(可以写slogan等)
      path: `/pages/langwen-recommend/langwen-recommend`, // 默认是当前页面，必须是以‘/’开头的完整路径
      // imageUrl: tempath,
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: "分享成功~"
          })
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () { }
    }
    return shareObj;
  },
})