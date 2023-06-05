// 系统启动后会对libs进行建全和直接引用的libs有所不同，因此init需要在启动系统后，uniapp启动前执行
import libs from '@/libs'

let { mode, vision, updateTime, globalData, deviceTypeId, userRole, subName } = libs.configProject
let univerifyStyle = { // 一键登录设置
  force: true, // 自定义强制登录参数，不登录则退出程序，默认值： false
  fullScreen: true, // 是否全屏显示，默认值： false
  icon: { path: globalData.config.logo },
  closeIcon: { path: globalData.config.transparent }, // 自定义关闭按钮，仅支持本地图片。 HBuilderX3.3.7+版本支持
  otherLoginButton: {
    visible: true, // 是否显示其他登录按钮，默认值：true
    callBack () {
      uni.reLaunch({ url: '/pages/index/loginPhone' })
    }
  }
}
let login = async () => {
  let phone = libs.data.getStorage('phone')
  let accessToken = ''
  let appid = {
    periodPain: 'a4d3eb8f-bab7-49b6-a2d9-1b6e8be181d8',
    PE: '8aa43396-9283-4eba-88ad-efe30d4ef2cf',
    sunshine: 'a283529e-4703-4381-9dba-1802349278a7',
    EMX: '5c827919-b938-4c4b-b19f-3b7bc5934c42'
  }[subName]
  globalData.headers = {
    appTerminalPlatform: libs.data.systemInfo.platform,
    appVersion: [mode, vision, updateTime].join('.'),
    deviceInfo: {},
    appGroup: mode,
    accessToken,
    deviceTypeId,
    appid,
    phone
  }

  // #ifdef MP-WEIXIN
  getApp().globalData.X.configProject.globalData.headers = globalData.headers
  // #endif

  // 已经有用户信息
  console.log(userRole, phone, '已经有用户信息', globalData.userInfo)
  if (globalData.userInfo) return { statusCode: 201, data: globalData.userInfo }
  // 医院登录
  if (userRole === 'hospital') return { statusCode: 'hospital' }
  // 用户登录
  if (!phone || 11 < phone.length) {
    // #ifdef APP-PLUS
    phone = libs.data.random(7)
    // phone = 13268125215//罗
    // phone = 18924166730// 红米
    // phone = 15914214657 //邦森
    // 检查是否应用市场审核中
    // if (!globalData.updateAppConfig.review.includes(vision)) {
    let { statusCode, data } = await libs.global.uniLogin.auto(univerifyStyle)
    switch (statusCode) {
      case 200:
        phone = data
        break
      case 30002:// 点击其他方式登陆
        return { statusCode, data }
      default:
        uni.showToast({ title: statusCode + data, icon: 'none', duration: 2000 })
        break
    }
    // }
    libs.data.setStorage('phone', phone)
    globalData.headers.phone = phone
    // #endif

    // #ifdef MP-WEIXIN
    uni.reLaunch({ url: '/login/loginPhone' })
    return
    // #endif
  }
  // 之前ssl生成的公钥，复制的时候要小心不要有空格
  //   const publiukey = `-----BEGIN PUBLIC KEY-----
  // MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDXmihNG2sviXVLaTzuWQ5WEYU6ZUV177quq1veOlVW12gsbEoEgJzRtbwr3bqoTM1C9n18nA1VdCs451ZUPTpJFclj01sethwg4nBsyqYzKN/ELRi3DWpkH35v2Pno+W8O0vXNeHKUFXOxsVdeXzq8zSo4Iy3fH3fwTGFyl/kPSwIDAQAB
  // -----END PUBLIC KEY-----`.trim()
  // let encryptedPhone = jsencrypt.setEncrypt(publiukey, phone)  // 对内容进行加密

  // 请求用户信息
  // console.log('请求用户信息', phone, encryptedPhone)
  // 优E康
  // let { data } = await libs.request(libs.api.wyjkDevice.user.oneClickLoginNormalPhone, { phone })
  // accessToken=data.userLogin.accessToken
  // let userInfo = globalData.userInfo = data.coreUser

  // 易循环
  let { data } = await libs.request(libs.api.ECirculation.user.login, { phone })
  data.realname = data.userName
  let userInfo = globalData.userInfo = data

  // console.log('请求用户信息', data)
  console.log('当前用户：', userInfo.realname, userInfo)
  return userInfo
}

export default login
