<template>
  <view class="itemBox">
    <xnw-from :config="{data:[firstLine,...currentList]}" />
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
export default {
  mixins: [mixinBLE],
  data () {
    return {
      firstLine: {
        key: 'name',
        title: '调整刺激强度',
        setClass: '',
        style: '',
        textContent: ''
      },
      currentList: [],
      step: .5,
      timeStamp: new Date().valueOf(), // 记录设置时间
      waiting: 2 * 1000, // 调电判断间隔
      intervalTime: 2000, // 同步设备强度间隔
      currentInterval: () => console.log('未设置强度心跳')
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created () {
    uni.showLoading({
      title: '请等待..',
      mask: true
    })
    this.init()
    this.currentSync()
    this.globalData.currentChange = this.currentChange
  },
  beforeDestroy () {
    clearInterval(this.currentInterval)
  },
  methods: {
    init () {
      let _global = { min: this.step, max: 50, step: this.step, typeDisabled: true, style: 'float:right', disabled: this.disabled }
      this.currentList = this.globalData.workout.channelList.map(item => item.spliceList)
        .flat()
        .map(item => ({
          channel: item.channel,
          key: item.side,
          title: item.postion,
          setClass: '',
          style: '',
          number: {
            ..._global,
            value: item.current,
            onMinus: this.currentChange,
            onPlus: this.currentChange
          }
        }))
      console.log('初始化强度按钮', this.currentList)
    },
    currentChange (n, item, type) {
      console.log('点击事件', n, item, type)
      let channel = item.channel
      let side = item.key
      let deviceState = this.globalData.deviceState[channel]
      let value = deviceState[side]
      if (n - value === 0) return
      this.timeStamp = new Date().valueOf()// 记录设置时间
      if (type === 'minus') side === 'settingCHL' ? this.leftMinus(channel) : this.rightMinus(channel)
      if (type === 'plus') side === 'settingCHL' ? this.leftPlus(channel) : this.rightPlus(channel)
    },
    currentSync () { // 模拟s指令
      this.currentInterval = setInterval(() => {
        if (!this.globalData.deviceState) return

        // 通道数据健全
        let _ready = this.globalData.workout.channelList.length === Object.keys(this.globalData.deviceState).length
        if (!_ready) return
        uni.hideLoading()

        this.currentList.forEach(item => {
          let _deviceState = this.globalData.deviceState[item.channel]
          // 没有当前通道数据
          if (!_deviceState) return

          // 判断禁用 stateRunning 运行状态，可以是: 0 设置 ，1 运行，2 暂停，3 停止，4 锁定
          let { settingCHL, settingCHR, stateRunning } = _deviceState
          item.number.disabled = this.disabled || ['2', '3', '4'].includes(stateRunning)

          let now = new Date().valueOf()
          // 当前时间少于最后设置强度时间+等待时间，不做操作
          if (now < this.timeStamp + this.waiting) return

          // 当前时间大于最后设置强度时间+等待时间，且强度不同步，更新强度显示
          if (item.key === 'settingCHL' && item.number.value === settingCHL) return
          if (item.key === 'settingCHR' && item.number.value === settingCHR) return
          item.number.value = Number(item.key === 'settingCHL' ? settingCHL : settingCHR)
        })
      }, this.intervalTime)
    }
  }
}
</script>
