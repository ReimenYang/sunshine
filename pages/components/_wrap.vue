<template>
  <scroll-view
    class="wrap"
    scrollY
    :style="{height}"
  >
    <slot />
  </scroll-view>
</template>
<script>
export default {
  props: {
    hasHeader: {
      type: Boolean,
      default: false
    },
    hasFooter: {
      type: Boolean,
      default: false
    },
    offset: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      height: '100vh'
    }
  },
  created () {
    getApp().globalData.Y = this
    if (this.offset) this.height += ` - ${this.offset}`
    if (this.hasHeader) this.height += ' - 150rpx'
    if (this.hasFooter) this.height += ' - 140rpx'
    this.height = `calc(${this.height})`
  }
}
</script>
