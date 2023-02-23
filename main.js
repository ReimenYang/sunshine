import Vue from 'vue'
import App from './App'
// import checkReady from '@/libs/uniInit'
import libs from '@/libs'

Vue.prototype.toast = (title, duration = 3000, icon = 'none') => uni.showToast({ title, duration, icon })
Vue.prototype.libs = libs
Vue.prototype.request = libs.request
Vue.prototype.api = libs.api
Vue.prototype.globalData = libs.configProject.globalData

let { globalData, isNewDevice, whiteList, blackList } = libs.configProject
let BioStimBleModule = libs.global.ble.BioStimBleModule
if (whiteList.length) BioStimBleModule.whiteList = whiteList
if (blackList.length) BioStimBleModule.blackList = blackList
console.log('初始化蓝牙模块')
globalData.isNewDevice = isNewDevice || 'N'
console.log('是否使用新设备:', globalData.isNewDevice)
console.log('白名单', BioStimBleModule.whiteList)
console.log('黑名单', BioStimBleModule.blackList)
// 以下三项设置改动机会不大，因此没有放到projectConfig
// 停止搜索蓝牙设备超时设置,默认:1000 * 10,单位：毫秒
// BioStimBleModule.discoveryTimeout = 1000 * 3
console.log('停止搜索蓝牙设备超时设置', BioStimBleModule.discoveryTimeout)
// 连接低功耗蓝牙设备超时设置,默认:1000 * 10,单位：毫秒
// BioStimBleModule.connectTimeOut(1000 * 3)
console.log('连接低功耗蓝牙设备超时设置', BioStimBleModule.connectTimeOut())
// 控制writeBLECharacteristicValue时间间隔,默认:100,单位：毫秒
// BioStimBleModule.writeTime(100)
console.log('控制writeBLECharacteristicValue时间间隔', BioStimBleModule.writeTime())

App.mpType = 'app'
const app = new Vue({ ...App })
app.$mount()
