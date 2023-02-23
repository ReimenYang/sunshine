<template>
  <view
    class="wrapBox"
    :style="{'--theme-color':globalData.config.theme}"
  >
    <p-wrap>
      <view class="itemBox">
        <view class="itemTitle">
          请开启设备电源以连接蓝牙
        </view>
        <image
          class="guide"
          :src="globalData.config.guideConnect"
          mode="widthFix"
        />
      </view>
      <connect-ble @onSelect="nextStep" />
    </p-wrap>
    <!-- <xnw-footer
      textConfirm="连接"
      :showCancel="false"
      @onConfirm="nextStep"
    /> -->
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
import connectBle from '@/pages/bluetooth/_connect'
export default {
  mixins: [mixinBLE],
  components: { connectBle },
  data () {
    return {
      nextTo: '/pages/scheme/index'
    }
  },
  async onLoad (option) {
    this.nextTo = option.nextTo || '/pages/scheme/index'
    this.globalData.pageInit = this.init
  },
  onShow () {
    this.globalData.handlePair = this.pageHandlePair
  },
  onHide () {
    this.stopSearch()
    delete this.globalData.pageInit
    // delete this.globalData.handlePair
  },
  methods: {
    init () {
      delete this.globalData.pageInit
      this.bleSearch()
    },
    async nextStep () {
      console.log('开始连接')
      this.stopSearch()
      // 保存设备信息，方便其他地方调用
      // this.globalData.device = this.device
      // this.libs.data.setStorage('device', this.globalData.device)
      return await this.connectDevice()
    },
    pageHandlePair (boolean) {
      console.log('连接配对跳转', this.nextTo)
      if (boolean) uni.redirectTo({ url: this.nextTo })
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
  .guide {
    width: 100%;
    padding-top: 20rpx;
  }
}
</style>
