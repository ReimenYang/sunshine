module.exports = {
  name: '晨硕治疗仪', // 项目名称 晨硕治疗仪
  projectName: 'sunshine', // 项目代号
  port: 8864, // 本地运行的端口
  framework: 'uni', // 使用前端框架:vue||uni
  appid: '__UNI__A93835A',
  // 一键登录
  // apiKey: '2cbeb0083ca06ce71e0c8aa700f8da9b', // 公司appid apiKey
  // apiSecret: '2523bede5154496dd21c9a9f68b2362c', // 公司appid apiSecret
  apiKey: 'e72a85e683138b13b23129f065768f49', // 个人appid apiKey
  apiSecret: '61e88a6b012b160a927a064c9fb7ef52', // 个人appid apiSecret
  // 发短信
  smsKey: 'c2dd9accc4efb6d179eb1c986d9a0c22', // 个人appid apiKey
  smsSecret: 'e328f8ba8628ecb3b0561ebbe06bbe15', // 个人appid apiSecret
  // 云数据库
  provider: 'aliyun', // aliyun、tencent
  spaceId: 'ec34b204-8f78-4a39-8ebd-3c4b40bf1b0a', // 个人appid apiKey
  clientSecret: 'Gwb8Fu5rEfeQEms8WnmjwA==', // 个人appid apiSecret
  projectType: {
    wechat: false,
    browser: false,
    app: true
  }, // 项目要运行的环境
  loginType: {
    phone: true // 一键登录
  }, // 用户登录方式
  vision: '0.01Bate', // 项目版本
  updateTime: '20230223', // 版本升级时间
  // webDeveloper: '127.0.0.1', // 前端开发本地路径
  webDeveloper: '10.10.20.101', // Reimen
  // webDeveloper: 'dev-weiming.xinuowang.com', 	// Reimen
  // webDeveloper: '10.10.20.41',
  // webDeveloper: 'localhost'
  mode: 'produce', // dev 开发环境、 test 测试环境、 produce 正式环境、 demo 演示环境、 pre 预发布环境
  userRole: 'user', // user 用户 hospital 医院
  /**  消费电子特有字段*/

  /** 设备类型id(deviceTypeId)
   * 14:DJZ-A
   * 15:ble
   * 16:优E康
   */
  deviceTypeId: 16,
  /** 针对病症分类的app(subName)
   * periodPain 痛经
   * PE 早泄
   * sunshine 晨硕治疗仪
   * EMX 穿戴设备
   */
  subName: 'PE',
  /** 是否使用多通道设备(isNewDevice)
   * Y/N 是/否
   */
  isNewDevice: 'Y',
  /** 允许搜索到的白名单(whiteList)
   * 默认：['MuscStim', 'BioStim', 'SSConsume']
   * SSConsume 优E康
   * OZ-A3 六通道
   * OZ-A2 四通道
   * EMX-C01 全身服
   * EMX-S01 短裤
   */
  whiteList: ['OZ-A3', 'OZ-A2', 'EMX-S01', 'EMX-C01', 'SSConsume'],
  /** 不允许搜索到的黑名单(blackList)
   * 默认：[]
   */
  blackList: []
}
