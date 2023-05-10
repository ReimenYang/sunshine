<template>
  <view
    class="firmwareUpdate"
    @click="getBin"
  >
    固件升级
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
export default {
  mixins: [mixinBLE],
  props: {
    time: {
      type: Number,
      default: () => 20
    }
  },
  data () {
    return {
      coreList: [],
      buffer: [],
      crcLength: 10240, // crc校验内容长度,字节
      splitLength: 20, // 切割长度,字节
    }
  },
  methods: {
    async getBin () {
      if (!this.libs.global.ble.BaseBleModule.deviceId) return this.toast('设备未连接')
      uni.showLoading({ title: '准备数据...' })
      // 保持不休眠
      // plus.device.setWakelock(true)
      // 保持屏幕常亮
      uni.setKeepScreenOn({ keepScreenOn: true })

      this.coreList = (await this.request(this.api.ECirculation.system.getDeviceCoreList)).data
      // this.coreList = [
      //   {
      //     'id': 10,
      //     'appId': 3,
      //     'coreType': '2',
      //     'coreVersion': '5',
      //     'coreUrl': 'https://mp-ec34b204-8f78-4a39-8ebd-3c4b40bf1b0a.cdn.bspapp.com/cloudstorage/bd9683b7-c474-4297-8b3f-73c337caba27.bin',
      //     'createTime': '2023-03-22 16:02:06'
      //     },
      //     {
      //       'id': 11,
      //       'appId': 3,
      //       'coreType': '1',
      //       'coreVersion': '5',
      //       'coreUrl': 'https://mp-ec34b204-8f78-4a39-8ebd-3c4b40bf1b0a.cdn.bspapp.com/cloudstorage/dacb7e34-3e1a-457a-b7b1-dc1c6a136fad.bin',
      //       'createTime': '2023-03-13 14:22:05'
      //   }
      // ]
      this.coreList.sort((a, b) => a.coreType - b.coreType)
      this.globalData.firmwareUpdate = this.firmwareUpdate
      this.coreInit()
    },
    // 制造阻塞
    sleep (time = this.time) { return new Promise(resolve => setTimeout(resolve, time)) },
    async coreInit () {
      let { commandSplit } = this.libs.global.ble.BaseBleModule
      let title = ''
      for (const item of this.coreList) {
        title = { 1: '主程序', 2: '部件' }[item.coreType] + '准备中...'
        uni.showLoading({ title })
        console.log(title)
        item.buffer = new Uint8Array(await this.request({ method: 'GET', url: item.coreUrl }, {}, { responseType: 'arraybuffer' }))
        // 按crc校验切割
        item.crcArr = commandSplit(item.buffer, this.crcLength)
        // 转换后的二进制队列，为发送使用
        item.splitList = item.crcArr.map(_arr => [
          // 切割内容
          ...commandSplit(_arr, this.splitLength).map(arr => (new Uint8Array(arr)).buffer),
          // 插入两位16进制校验码
          this.libs.global.ble.CRC.CRC16(_arr, 'buffer')
        ]).flat()
      }
      let arg = this.coreList.map(item => [item.coreType, item.buffer.length, item.crcArr.length]).flat()
      title = '更新即将开始...'
      console.log(title, arg)
      uni.showLoading({ title })
      this.firmwareReady(...arg)
    },
    async firmwareUpdate () {
      let { deviceId, serviceId, characteristicId } = this.libs.global.ble.BaseBleModule
      let t = new Date()
      for (const item of this.coreList) {
        let title = { 1: '主程序', 2: '部件' }[item.coreType] + '更新中...'
        uni.showLoading({ title })
        console.log(title)
        await this.sleep(3000) // 设备切换bootLoad模式需要时间
        for (const value of item.splitList) {
          uni.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, value })
          await this.sleep()
        }
        if (this.globalData.firmware === false) return
      }
      console.log('用时', new Date() - t)
      await this.sleep(2000)
      this.libs.data.exit('设备已更新，请重启APP和设备')
    }
  }
}
</script>
