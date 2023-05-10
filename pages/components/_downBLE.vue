<template>
  <image
    style="width:100%"
    :src="target.bg"
    mode="widthFix"
    @click="jumpTo"
  />
</template>

<script>
export default {
  props: {
    setting: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      timeStamp: new Date().valueOf(),
      target: {}
    }
  },
  created () {
    this.target = {
      type: 'ble',
      showModal: 'bg',
      from: 'web',
      isForce: 'N',
      ...this.setting
    }
    let { showModal, from } = this.target
    if (from === 'web') uni.setNavigationBarTitle({ title: this.target.title })
    if (showModal === 'dialog') this.showModal()
    setTimeout(this.share, 2000)
  },
  methods: {
    async share () {
      let shareOption = {
        title: this.target.title,
        link: location.href,
        imgUrl: this.target.bg,
        dec: `最新版本${this.target.title}`
      }
      try {

        this.$wxjs.wexinShare.init(() => this.$wxjs.wexinShare.shareTimeline(shareOption))
      } catch (e) {
        // TODO handle the exception
      }
    },
    showModal () {
      uni.showModal({
        title: '更新提示',
        content: '新版本已上线，请点击更新',
        confirmText: '更新',
        showCancel: this.target.isForce === 'N',
        success: res => {
          if (res.cancel) return this.$emit('onCancel')
          if (res.confirm) {
            this.jumpTo()
            this.$emit('onConfirm')
          }
        }
      })
    },
    jumpTo () {
      let platform = uni.getSystemInfoSync().platform
      // #ifdef APP-PLUS
      plus.runtime.openURL(this.target[platform] + '?timeStamp=' + this.timeStamp)
      // #endif
      // #ifdef H5
      if (platform !== 'ios' && navigator.userAgent.match('MicroMessenger')) return location.href = this.target.app
      location.href = this.target[platform] + '?timeStamp=' + this.timeStamp
      // #endif
    }
  }
}
</script>
<style>
page {
  background-color: #fff;
}
</style>
