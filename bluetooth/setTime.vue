<template>
  <view
    class="wrapBox themeBg"
    :style="theme"
  >
    <p-header
      backIcon="show"
      title="准备训练"
    />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
    >
      <!-- <p-steps :active="0" /> -->
      <view class="itemBox">
        <view class="itemTitle">
          请设置训练时长
        </view>
        <xnw-number
          v-model="time"
          :min="1"
          :max="180"
          :step="1"
          :typeDisabled="true"
          @change="setWorkTime"
        />
      </view>
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
export default {
  mixins: [mixinBLE],
  data () {
    return {
      time: this.globalData.workout.duration / 60, // 单位：分,
      theme: `--theme-color:${this.globalData.config.theme} `
    }
  },
  methods: {
    timeChange (time) {
      return this.setWorkTime(time)
    },
    async nextStep () {
      uni.showLoading({
        title: '正在初始化...',
        mask: true
      })
      await this.sendInitCmd()
      uni.hideLoading()
      // 这里应该在EventBus响应的回调做个别处理？？
      this.globalData.workout.duration = this.workTime
      uni.redirectTo({ url: '/bluetooth/setCurrent' })
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
  // #ifndef MP-WEIXIN
  .uni-numbox {
    zoom: 2;
    margin: 75rpx auto;
  }
  // #endif
  // #ifdef MP-WEIXIN
  /deep/ .uni-numbox {
    line-height: 140rpx;
    width: 480rpx;
    margin: 75rpx auto;
    .uni-numbox__minus,
    .uni-numbox__plus {
      height: 140rpx;
      width: 140rpx;
      border-width: 2rpx;
      .uni-numbox--text {
        font-size: 48rpx;
      }
    }
    .uni-numbox__value {
      width: 160rpx;
      height: 140rpx;
      border-width: 2rpx 0;
      font-size: 48rpx;
    }
  }
  // #endif
  .btn {
    height: 140rpx;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    border-top: var(--border-normal);
    background: #fff;
  }
}
</style>
