<template>
  <view class="wrap">
    <clock
      class="info"
      :percent="countTo/countEnd"
    >
      <view>
        <view class="remain">
          剩余时间
        </view>
        <view class="countdown">
          {{ (minute+second==='000')?'已结束':`${minute}:${second}` }}
        </view>
        <view class="workoutName">
          {{ option.workoutName }} {{ option.time }}分钟
        </view>
      </view>
    </clock>
    <view class="schemeName">
      {{ option.schemeName }}
    </view>
    <view class="note">
      如需要调整刺激强度，请在设备进行调整<br>
      如需要停止训练，请直接点击设备的电源键
    </view>
  </view>
</template>
<script>
import clock from '@/libs/components/uniapp/simplePie/simplePie.vue'
export default {
  components: { clock },
  data () {
    return {
      option: {},
      countEnd: 0,
      countTo: 0,
      minute: 0,
      second: 0
    }
  },
  onLoad (option) {
    this.option = option
    this.countEnd = this.option.time * 60
    this.countdown()
  },
  beforeDestroy () {
    this.countdown = () => console.log('退出倒计时')
  },
  methods: {
    countdown () {
      this.countTo++
      let remain = this.countEnd - this.countTo
      this.minute = Math.floor(remain / 60)
      this.second = remain % 60
      if (this.second < 10) this.second = '0' + this.second
      if (remain <= 0) return console.log('训练结束')
      return setTimeout(this.countdown, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  padding: 20rpx;
  color: var(--color-light);
  font-size: var(--font-h3);
  text-align: center;
  .info {
    margin: auto;
    .countdown {
      padding: 40rpx 0;
      font-size: var(--font-h1);
      color: var(--color-normal);
    }
    .workoutName {
      padding: 0 20rpx;
      line-height: 80rpx;
      border-radius: 30rpx;
      background: #f3f8f9;
    }
  }
  .schemeName {
    line-height: 3;
    color: var(--color-normal);
  }
  .note {
    font-size: var(--font-h4);
  }
}
</style>
