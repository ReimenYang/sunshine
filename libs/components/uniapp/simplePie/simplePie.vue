<template>
  <view
    class="pieBox"
    :style="color"
  >
    <view :class="{pie:true, more: percent>.5} ">
      <view
        class="runner"
        :style="runnerStyle"
      />
    </view>
    <view
      class="cover"
      :style="coverBg"
    >
      <slot />
    </view>
  </view>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: '300px'
    },
    colorValue: {
      type: String,
      default: 'yellowgreen'
    },
    colorEmpty: {
      type: String,
      default: '#655'
    },
    coverBg: {
      type: String,
      default: ''
    },
    percent: { // 100%=1
      type: Number,
      default: .8
    }
  },
  data () {
    return {
      color: '',
      runnerStyle: '',
      coverStyle: ''
    }
  },
  watch: {
    percent: function () { this.init() },
    coverBg: function () { this.init() }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.runnerStyle = `transform: rotate(${this.percent}turn);`
      this.coverStyle = this.coverBg ? `background-image:url(${this.coverBg})` : ''
      this.color = `--color-empty: ${this.colorEmpty}; --color-value: ${this.colorValue};--size:${this.size}`
    }
  }
}
</script>
<style lang="scss" scoped>
.pieBox {
  width: var(--size);
  height: var(--size);
  margin: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .pie {
    width: calc(var(--size) - 2px);
    height: calc(var(--size) - 2px);
    box-sizing: border-box;
    border-radius: 50%;
    background: var(--color-empty);
    background-image: linear-gradient(
      to right,
      transparent 50%,
      var(--color-value) 0
    );
    &.more {
      background: var(--color-value);
      background-image: linear-gradient(
        to right,
        transparent 50%,
        var(--color-empty) 0
      );
      transform: rotate(0.5turn);
    }
    .runner {
      display: block;
      margin-left: 50%;
      height: 100%;
      border-radius: 0 100% 100% 0/50%;
      background-color: inherit;
      transform-origin: left;
    }
  }
  .cover {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    // #ifdef MP-WEIXIN
    background: url("http://download.health10.cn/ECirculation/mpWeixinStatic/coverBg.png")
      no-repeat center/100%;
    // #endif
    // #ifndef MP-WEIXIN
    background: url("./coverBg.png") no-repeat center/100%;
    // #endif
  }
}
</style>
