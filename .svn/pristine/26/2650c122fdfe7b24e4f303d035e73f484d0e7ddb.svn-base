<template>
  <view class="phaseSetting">
    <view>{{ setting.channel }}通道-阶段{{ setting.phase }}程序设置</view>
    <xnw-from
      :config="setting"
      ref="phaseSetting"
    />
    <view class="btnGroup fix">
      <view
        class="btn"
        @click="onCancel"
      >
        取消
      </view>
      <view
        class="btn primary"
        @click="onConfirm"
      >
        确定
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    setting: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onCancel () {
      this.$emit('onCancel')
    },
    onConfirm () {
      let _verify = this.setting.data.map(item => item.input ? item.input.input('', item) : true)
      if (_verify.includes(false)) return
      let params = this.$refs.phaseSetting.getFromData()
      params.waveform = params.waveform[0].value
      for (let key in params) params[key] = Number(params[key] || 0)
      params.channel = params.channelID = this.setting.channelID
      params.channelName = this.setting.channelName
      params.phase = this.setting.phase
      this.$emit('onConfirm', params)
    }
  }
}
</script>
<style lang="scss" scoped>
.phaseSetting {
  padding: 30rpx;
  /deep/ {
    .form {
      .title {
        width: 10em;
      }
      .radio .label {
        display: block;
      }
    }
  }
}
</style>
