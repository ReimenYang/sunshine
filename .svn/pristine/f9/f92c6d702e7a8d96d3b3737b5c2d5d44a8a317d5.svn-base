<template>
  <view>
    <view
      class="channelConfig"
      v-for="(channel,i) in config"
      :key="channel.name"
      v-show="channel.show && showIndex === i"
    >
      <view>{{ channel.name }}</view>
      <xnw-from
        :config="channel.channelFrom"
        ref="channelConfig"
      />
      <view class="phaseTitle">
        治疗阶段
        <view
          class="btn"
          @click="addPhase(channel)"
        >
          新增
        </view>
      </view>
      <xnw-item
        v-for="(phase,index) in channel.phaseFrom"
        :key="phase.title"
        :info="phase"
      >
        <view slot="footer">
          <view class="footer btnGroup">
            <view
              class="btn"
              @click="onEdit(phase)"
            >
              编辑
            </view>
            <view
              class="btn"
              @click="onDel(channel,index)"
            >
              删除
            </view>
          </view>
        </view>
      </xnw-item>

      <view class="btnGroup fix">
        <view
          class="btn"
          @click="prevStep"
        >
          上一步
        </view>
        <view
          class="btn primary"
          @click="nextStep"
        >
          {{ (showIndex+1) === config.length ? '确定修改' : '下一步' }}
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    config: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showIndex: 0
    }
  },
  methods: {
    prevStep () {
      this.showIndex--
      if (this.showIndex < 0) this.$emit('prevStep')
    },
    nextStep () {
      let _channel = this.config[this.showIndex]
      let emptyPostion = _channel.channelFrom.data.reduce((a, b) => b.link.label ? a : [...a, b.key], []).join()
      if (emptyPostion) return this.toast(emptyPostion + '插口-电刺激部位不能为空')
      if (!_channel.phaseFrom.length) return this.toast('治疗阶段不能为空')
      this.showIndex++
      if (this.showIndex === this.config.length) this.$emit('onConfirm')
    },
    addPhase (channel) {
      let { workoutChannelId, phase = 0 } = channel.phaseList.slice(-1)[0] || {}
      let _phase = {
        channelName: channel.channelName,
        channelID: channel.channelID,
        workoutChannelId,
        phase: phase + 1,
        waveform: 1,
        frequency: '',
        pulseWidth: '',
        frequencyB: '',
        pulseWidthB: '',
        frequencyC: '',
        pulseWidthC: '',
        rampUpTime: 0,
        steadyTime: 0,
        rampDownTime: 0,
        restTime: 0,
        relativePower: 100
      }
      return this.onEdit(_phase)
    },
    onEdit (phase) {
      this.$emit('onEdit', phase)
    },
    onDel (channel, index) {
      this.$emit('onDel', { channel, index })
    }
  }
}
</script>
<style lang="scss" scoped>
.channelConfig {
  padding: 30rpx;
  .btn {
    padding: 0 40rpx;
    border-radius: 30rpx;
    font-size: var(--font-h4);
    line-height: 60rpx;
    border: var(--border-style);
  }
  .phaseTitle {
    padding: 20rpx 20rpx 20rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn {
      color: #fff;
      background: var(--theme-color);
    }
  }
  /deep/ {
    .itemBox {
      margin-bottom: 20rpx;
      position: relative;
      font-size: var(--font-h4);
      line-height: 1.5;
      .title {
        font-size: inherit;
        min-height: auto;
        font-weight: bold;
      }

      .tagBox {
        margin-top: 0;
        .txt {
          font-size: inherit;
          line-height: inherit;
        }
      }
    }
  }
  .footer.btnGroup {
    height: calc(100% - 30rpx);
    margin: 0rpx;
    flex-direction: column;
    justify-content: space-evenly;
    position: absolute;
    top: 30rpx;
    right: 20rpx;
    .btn {
      flex: none;
      color: var(--theme-color);
    }
  }
}
</style>
