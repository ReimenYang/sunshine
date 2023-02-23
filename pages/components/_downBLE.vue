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
      config: {
        ble: {
          title: '杉山低频神经肌肉治疗仪下载',
          ios: 'https://apps.apple.com/cn/app/id1526096144',
          android: 'https://sapi.xinuowang.com:9000/product-public/donwload/ble/lastest.apk',
          app: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.shanshan.ble',
          bg: 'https://sapi.xinuowang.com:9000/product-public/donwload/ble/downBg.jpg'
        },
        consume: {
          title: '消费电子app下载',
          // ios: 'https://apps.apple.com/cn/app/id1526096144',
          android: 'https://sapi.xinuowang.com:9000/product-public/donwload/consume/lastest.apk',
          app: 'https://sapi.xinuowang.com:9000/product-public/donwload/consume/lastest.apk',
          // app: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.shanshan.ble',
          bg: 'https://sapi.xinuowang.com:9000/product-public/donwload/consume/downBg.jpg'
        },
        ECirculation: {
          title: '易循环app下载',
          // ios: 'https://apps.apple.com/cn/app/id1049660516',
          android: 'http://download.health10.cn/lastest.apk',
          app: 'http://download.health10.cn/lastest.apk',
          // app: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.shanshan.ble',
          bg: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-ec34b204-8f78-4a39-8ebd-3c4b40bf1b0a/6eae746a-9435-4f12-b8fc-aacacf3f0af7.png'
        },
        ukang: {
          title: '优家康app下载',
          ios: 'https://apps.apple.com/cn/app/id1049660516',
          android: 'https://sapi.xinuowang.com:9000/product-public/donwload/consume/lastest.apk',
          app: 'https://sapi.xinuowang.com:9000/product-public/donwload/consume/lastest.apk',
          // app: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.shanshan.ble',
          bg: 'https://sapi.xinuowang.com:9000/product-public/donwload/consume/downBg.jpg'
        }
      },
      target: {}
    }
  },
  created () {
    this.target = {
      ...this.config[this.setting.type],
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
      this.$wxjs.wexinShare.init(() => this.$wxjs.wexinShare.shareTimeline(shareOption))
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
