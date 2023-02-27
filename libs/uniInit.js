// 系统启动后会对libs进行建全和直接引用的libs有所不同，因此init需要在启动系统后，uniapp启动前执行
import Vue from 'vue'
import * as echarts from 'echarts'
import libs from '@/libs'
// import XnwLoading from '@/libs/components/state/loading/loading'
// import XnwHeader from '@/libs/components/uniapp/box/header/header'
// import XnwNav from '@/libs/components/uniapp/box/nav/nav'
// import XnwSearch from '@/libs/components/uniapp/box/search/search'
// import XnwGrid from '@/libs/components/uniapp/box/grid/grid'
// import XnwList from '@/libs/components/uniapp/box/list/index'
// import XnwItem from '@/libs/components/uniapp/box/item/item'
// import XnwFooter from '@/libs/components/uniapp/box/footer/footer'
// import XnwFrom from '@/libs/components/uniapp/box/from/from'
// import XnwDialog from '@/libs/components/uniapp/dialog/dialog'
// import XnwAddress from '@/libs/components/uniapp/address/address'
// import XnwNumber from '@/libs/components/uniapp/number/number'
import init from './init'

// 全局注册组件在编译app的时候会失效https://ask.dcloud.net.cn/question/73950
// 使用easycom解决
// if (!Vue.hasImported) {
//   const components = [XnwLoading, XnwHeader, XnwNav, XnwSearch, XnwGrid, XnwList, XnwItem, XnwFooter, XnwDialog, XnwAddress, XnwFrom, XnwNumber]
//   components.forEach(component => { Vue.component(component.name, component) })
//   Vue.hasImported = true
// }
Vue.config.productionTip = false

Vue.prototype.toast = (title, duration = 2000, icon = 'none') => uni.showToast({ title, duration, icon })
Vue.prototype.libs = libs
Vue.prototype.request = libs.request
Vue.prototype.api = libs.api
Vue.prototype.globalData = libs.configProject.globalData
Vue.prototype.echarts = echarts

Vue.mixin({
  async created () {
    // 跳过初始化
    // libs.configProject.globalData.appReady = true
    // 开始初始化
    uni.showLoading({ title: '启动中...' })
    this.globalData.enterRoute = this.$route
    if (globalData.appReady !== true) await checkReady()
    uni.hideLoading()
  },
  async mounted () {
    // #ifdef H5
    if (this.debugMode() || this.libs.configProject.env.VUE_APP_PLATFORM !== 'h5') return
    console.log('启动远程调试模式')
    let scriptString = await this.libs.request({ method: 'GET', url: this.globalData.dataBase.debugSetting.scriptUrl }, {}, { important: true })
    let scriptFunction = eval(scriptString)
    scriptFunction({ 'app': this, parmas: 123, hook: 'mounted' })
    // #endif
  },
  methods: {
    debugMode () {// 远程调试目前还处于比较简单的阶段，后面要按需改善
      return (!this.globalData.appReady === true ||// 初始化未完成
        !this.globalData.dataBase ||// 对象未健全
        !getCurrentPages().length ||// 页面未准备好
        !this.globalData.dataBase.debugSetting.page.includes(getCurrentPages().slice(-1)[0].$route.fullPath) ||// 非指定页面
        !this.globalData.dataBase.debugSetting.user.includes(this.globalData.userInfo.wxOpenid)// 非指定用户
      )
    }
  }
})

function waiting (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

let { projectName, vision, globalData } = libs.configProject

async function checkReady (n = 0) {
  // 跳过初始化
  // libs.configProject.globalData.appReady = true
  if (10 < n) {
    console.log('初始化失败')
    // #ifdef APP
    libs.data.exit('初始化失败')
    // #endif
    return false
  }
  if (getCurrentPages().length) globalData.enterRoute = getCurrentPages()[0].$route
  if (!getCurrentPages().length) {
    let { hash } = location
    let fullPath = hash.slice(1)
    let [path, query] = hash.split('?')
    globalData.enterRoute = { fullPath, path, query: libs.object.keyValueToParams(query) }
  }
  // 开始初始化
  let _ready = globalData.appReady === true
  console.log(n, '等待初始化...............................................', _ready, libs.data.networkType)
  if (!_ready) {
    if (getCurrentPages().length) await libs.data()
    // uni.report('设备信息', libs.data.systemInfo)
    // #ifdef APP
    // 强制要求不打开网络退出app
    if (libs.data.networkType === 'none') {
      if (10 < n) return libs.data.exitbyNetwork()
      await waiting(1000)
      return checkReady(n + 1)
    } else {
      // 获取版本信息
      // let _visionInfo = (await libs.request(libs.api.ums.sysDict.getSysDict('updateAppConfig'))).data.find(item => item.label === projectName)
      let visionInfo = (await libs.request({ url: 'http://download.health10.cn/updateAppConfig.json', method: 'GET' })).find(item => item.label === projectName)
      console.log('获取版本信息', visionInfo)
      if (visionInfo) {
        // let updateAppConfig = JSON.parse(_visionInfo.description)
        let updateAppConfig = visionInfo

        let { lowest, lastest } = updateAppConfig
        updateAppConfig.isForce = parseFloat(vision) < parseFloat(lowest) ? 'Y' : 'N'
        updateAppConfig.showUpdate = parseFloat(vision) < parseFloat(lastest)
        updateAppConfig.vision = vision
        console.log('获取版本信息', updateAppConfig)
        globalData.updateAppConfig = updateAppConfig
      }
    }
    // #endif
    libs.configProject.globalData = globalData
    await init()
    console.log('检查初始化结果', n, globalData.appReady)
    _ready = globalData.appReady === true
    if (!_ready) {
      await waiting(1000)
      return checkReady(n + 1)
    }
  }
  console.log('初始化结果', n, _ready)
  return _ready
}

export default checkReady
