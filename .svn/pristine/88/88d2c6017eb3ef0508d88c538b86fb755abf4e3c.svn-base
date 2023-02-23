<template>
  <view
    class="wrapBox themeBg"
    :style="{'--theme-color':globalData.config.theme}"
  >
    <p-header
      backIcon="show"
      title="准备训练"
    />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
    >
      <!-- <p-steps :active="2" /> -->
      <set-current />
    </p-wrap>
    <xnw-footer
      textConfirm="下一步"
      :showCancel="false"
      @onConfirm="nextStep"
    />
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
import setCurrent from '@/pages/bluetooth/_setCurrent'
export default {
  mixins: [mixinBLE],
  components: { setCurrent },
  onBackPress () {
    this.endTreatment()
    delete this.globalData.deviceState
  },
  methods: {
    async nextStep () {
      if (!this.bleState.paired) return this.toast('请先配对并初始化设备')
      let currentList = Object.values(this.globalData.deviceState).reduce((a, b) => [...a, Number(b.settingCHL), Number(b.settingCHR)], [])
      console.log(this.globalData.deviceState, currentList, currentList.includes(0))
      let currentReady = !currentList.includes(0)

      if (!currentReady) return this.toast('刺激强度不能设置为0')

      let recordId = this.libs.data.random(7)// 代替请求recordId
      await this.setRecord(recordId)
      setTimeout(async () => {// 设备写入recordId需要时间
        uni.showLoading({
          title: '准备开始',
          mask: true
        })
        await this.startTreatment()
        // 请求训练id，写入训练设备
        let { workoutId, duration, workoutName, workoutDescription, portNum = 2, initCommand = '0,0,0' } = this.globalData.workout
        let [, , phaseNumber] = initCommand.split(',')
        let { sn, phone } = this.globalData.userInfo
        let params = this.globalData.workoutRecord = {
          deviceName: this.device.name, recordId, workoutId, duration,
          workoutName, workoutDescription, portNum, phaseNumber,
          totalTime: duration,
          workout: this.globalData.workout,
          time: 0, // 已训练时间
          terminalInfo: { deviceName: this.device.name },
          startTime: new Date().valueOf(),
          startDateTime: this.libs.data.dateNow(),
          isStop: 0,
          phone, sn
        }
        let _data = (await this.libs.request(this.libs.api.ECirculation.treatment.startTreatment, params)).data
        console.log('请求训练id，写入训练设备', params, _data)
        uni.hideLoading()
        uni.reLaunch({ url: '/pages/bluetooth/running' })
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapBox {
  height: 100vh;
  padding: 0 20rpx 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .setStep {
    display: flex;
    justify-content: space-between;

    .nextStep {
      padding: 0 40rpx;
      border-radius: 30rpx;
      font-size: var(--font-h4);
      line-height: 60rpx;
      background: var(--theme-color);
      color: #fff;
    }
  }
  /deep/ .form .formGroup {
    padding: 30rpx 0;
    .title {
      width: 8em;
    }
    .uni-numbox {
      zoom: 1.5;
    }
  }
}
</style>
