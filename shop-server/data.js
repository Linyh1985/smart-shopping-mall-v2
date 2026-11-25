// ======================================================================
// 本地商品数据（Mock 数据）
// ----------------------------------------------------------------------
// 项目说明：既然后端不接入了，我们就用这份本地数据来驱动整个购物系统。
// 所有页面（首页、详情页、分类页）都从这份数据里读取商品。
//
// 字段说明：
//   id          —— 商品唯一标识（数字）
//   title       —— 商品名称
//   price       —— 价格（字符串，方便显示；需要计算时用 Number() 转数字）
//   image       —— 商品图片 URL
//   description —— 商品描述
//   category    —— 商品分类（对应首页表单的选项：数码、服饰、食品、家居、美妆）
//   sales       —— 销量（字符串，如 "1.2万"）
// ======================================================================
const products = [
  // ========== 数码类 ==========
  {
    id: 1,
    title: 'Apple iPhone 15 Pro',
    price: '7999.00',
    image: 'https://img1.mydrivers.com/img/20221229/5152d27edbcd4815aac3a29d4603ed9e.jpg',
    description: '钛金属设计，A17 Pro 芯片，专业级摄像系统',
    category: '数码',
    sales: '1.2万',
  },
  {
    id: 2,
    title: 'MacBook Air M3',
    price: '8999.00',
    image: 'https://cdn.mos.cms.futurecdn.net/gbho6bhS4xVL3gU2MVYx7U.jpg',
    description: '轻薄便携，全天候续航，M3 芯片强劲性能',
    category: '数码',
    sales: '8600',
  },
  {
    id: 3,
    title: 'iPad Air',
    price: '4799.00',
    image: 'https://x0.ifengimg.com/ucms/2024_19/D407A0AA72B3A8C5AE04A9C8EDE7E4A37DC34F88_size42_w887_h500.jpg',
    description: '强劲性能，创意无限，支持 Apple Pencil',
    category: '数码',
    sales: '1.1万',
  },
  {
    id: 4,
    title: 'AirPods Pro',
    price: '1899.00',
    image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.134VJ44OStJo8DrF8-JnyAHaHa?w=193&h=193&c=8&rs=1&qlt=90&o=6&dpr=1.9&pid=ImgAns&rm=2',
    description: '主动降噪，空间音频，沉浸式聆听体验',
    category: '数码',
    sales: '9500',
  },
  {
    id: 5,
    title: 'Apple Watch Series 9',
    price: '2999.00',
    image: 'https://ts4.tc.mm.bing.net/th/id/OIP-C.4U5UMoYhdt0tuqFhkGpAHwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '健康监测，运动追踪，智能生活伴侣',
    category: '数码',
    sales: '6800',
  },
  {
    id: 6,
    title: 'Magic Mouse',
    price: '799.00',
    image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.PiUdF3k8H0W5q1auoEPMYQHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '多点触控表面，精准操控，无线连接',
    category: '数码',
    sales: '3200',
  },
  {
    id: 17,
    title: '华为 Mate 60 Pro',
    price: '6999.00',
    image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.D-L4L2LymZqzF0287FI-iAHaKe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '麒麟芯片，卫星通话，昆仑玻璃',
    category: '数码',
    sales: '2.1万',
  },
  {
    id: 18,
    title: '小米 14 Ultra',
    price: '5999.00',
    image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.MIfXfsGs4XydQhsChU284AHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '徕卡影像，第三代骁龙8，专业摄影',
    category: '数码',
    sales: '8900',
  },

  // ========== 服饰类 ==========
  {
    id: 7,
    title: '纯棉基础款圆领T恤',
    price: '99.00',
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN01RtKzLE1tohGA1DQFo_!!2219016445949-0-cib.310x310.jpg',
    description: '亲肤透气，百搭版型，多色可选',
    category: '服饰',
    sales: '8600',
  },
  {
    id: 8,
    title: '帆布休闲双肩包',
    price: '199.00',
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN01AtkHEZ2At8TBfaI6Z_!!2511218260-0-cib.310x310.jpg',
    description: '大容量收纳，轻便耐磨，通勤出游两相宜',
    category: '服饰',
    sales: '4100',
  },
  {
    id: 15,
    title: '经典百搭小白鞋',
    price: '299.00',
    image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.-uyMRHVQ7EOx-B3dlT7eKQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '柔软透气，轻便耐磨，通勤休闲都能穿',
    category: '服饰',
    sales: '5600',
  },
  {
    id: 19,
    title: '优衣库摇粒绒外套',
    price: '399.00',
    image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.hpwzy-IWqgaysTdqNx6LJwHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '轻盈保暖，简约设计，秋冬必备',
    category: '服饰',
    sales: '1.3万',
  },
  {
    id: 20,
    title: 'Nike Air Force 1',
    price: '899.00',
    image: 'https://images.wave.fr/images/nike-air-force-1-100-1.jpg',
    description: '经典篮球鞋款，舒适缓震，潮流百搭',
    category: '服饰',
    sales: '2.8万',
  },

  // ========== 食品类 ==========
  {
    id: 9,
    title: '三只松鼠每日坚果礼盒',
    price: '129.00',
    image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.xwFEUUbUxq_3-5fPPlLYtwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '多种坚果混合，独立小包装，健康零食',
    category: '食品',
    sales: '2.4万',
  },
  {
    id: 13,
    title: '奥利奥夹心饼干',
    price: '29.90',
    image: 'https://himall-storage-1259069382.cos.ap-nanjing.myqcloud.com/web/Storage/Shop/66/Products/23155/1.png',
    description: '多种口味任你挑选，酥脆可口，下午茶首选',
    category: '食品',
    sales: '5.6万',
  },
  {
    id: 14,
    title: '三顿半冷萃咖啡',
    price: '89.00',
    image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.kP9Sv16LoVvHE3y_b6QGrgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '即溶冻干咖啡，3 秒速溶，冷热皆宜',
    category: '食品',
    sales: '1.9万',
  },
  {
    id: 21,
    title: '良品铺子猪肉脯',
    price: '49.90',
    image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.a4Soii5absRPhdJ1tr5bUQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '精选猪后腿肉，蜜汁风味，越嚼越香',
    category: '食品',
    sales: '3.2万',
  },

  // ========== 家居类 ==========
  {
    id: 10,
    title: '简约北欧风护眼台灯',
    price: '159.00',
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN01ZtCLh61ExUGAZmhGf_!!2212361270418-0-cib.jpg',
    description: '三档调光，柔和护眼，适合阅读办公',
    category: '家居',
    sales: '3200',
  },
  {
    id: 12,
    title: '智能扫地机器人',
    price: '2199.00',
    image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.6VRLSiagt4rAm_2Fw1hH1wHaE7?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '激光导航，自动集尘，解放双手',
    category: '家居',
    sales: '5600',
  },
  {
    id: 22,
    title: '小米空气净化器 4',
    price: '1299.00',
    image: 'https://ts4.tc.mm.bing.net/th/id/OIP-C.aAicPdAr9juk4SER6I2EjwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '高效除甲醛，静音设计，智能互联',
    category: '家居',
    sales: '1.5万',
  },
  {
    id: 23,
    title: '无印良品香薰机',
    price: '299.00',
    image: 'https://y.zdmimg.com/201502/13/54de0a8060c65.jpeg',
    description: '超声波雾化，静音加湿，营造舒适氛围',
    category: '家居',
    sales: '8900',
  },

  // ========== 美妆类 ==========
  {
    id: 11,
    title: '兰蔻小黑瓶精华',
    price: '760.00',
    image: 'https://imgservice.suning.cn/uimg1/b2c/image/fiqvWXGpjKu8Js15N2B5JQ.jpg',
    description: '修护肌底，改善暗沉，适合多种肤质',
    category: '美妆',
    sales: '1.8万',
  },
  {
    id: 16,
    title: '迪奥烈艳蓝金口红',
    price: '320.00',
    image: 'https://himall-storage-1259069382.cos.ap-nanjing.myqcloud.com/web/Storage/Shop/439/Products/48748/1.png',
    description: '经典正红色，显白提气色，质地丝滑',
    category: '美妆',
    sales: '2.2万',
  },
  {
    id: 24,
    title: 'SK-II 神仙水',
    price: '1590.00',
    image: 'https://www.anyserves.shop/fileserver/image/group1/M00/21/54/rBAAcV9rPuWACDhaAAMuVokNmvw212.jpg',
    description: 'PITERA 精华，调节肌肤状态，明星产品',
    category: '美妆',
    sales: '1.1万',
  },
  {
    id: 25,
    title: '雅诗兰黛小棕瓶',
    price: '890.00',
    image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.to9hnN1ptD2j-IuUrZFmkAHaJ7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: '夜间修护，抗初老，经典精华',
    category: '美妆',
    sales: '1.6万',
  },
]
module.exports = products;