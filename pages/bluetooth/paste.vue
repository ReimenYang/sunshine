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
      <!-- <p-steps :active="1" /> -->
      <view class="item">
        <view class="itemTitle">
          {{ imageList[index].channelName }}通道如图接电极片
        </view>
        <image
          :src="imageList[index].url"
          class="swiperImg"
          mode="widthFix"
        />
      </view>
    </p-wrap>
    <xnw-footer
      textConfirm="下一步"
      textCancel="上一步"
      @onConfirm="nextStep"
      @onCancel="prevStep"
    />
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
export default {
  mixins: [mixinBLE],
  data () {
    return {
      imageList: [],
      index: 0
    }
  },
  onShow () {
    this.imageList = []
    this.globalData.workout.channelList.forEach(item => {
      item.imageUrl.split(',').forEach(url => {
        this.imageList.push({
          channel: item.channel,
          channelName: ['A', 'B', 'C', 'D'][item.channel - 1],
          url
        })
      })
    })
  },
  onBackPress () {
    this.endTreatment()
    delete this.globalData.handleLongRecived
    delete this.globalData.deviceState
  },
  methods: {
    nextStep () {
      if (this.index + 1 < this.imageList.length) return this.index++
      uni.redirectTo({ url: '/pages/bluetooth/setTime' })
    },
    prevStep () {
      if (0 < this.index) return this.index--
      this.reLaunchIndex('paste')
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
  .item {
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: var(--border-radius);
    background: #fff;
    font-size: var(--font-h35);
    line-height: 3;
    .itemTitle {
      margin-bottom: 20rpx;
      font-size: var(--font-h3);
      line-height: 1.5;
      color: var(--theme-color);
    }
  }
  .swiperImg {
    width: 100%;
  }
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
