<template>
  <view
    class="wrapBox"
    :style="theme"
  >
    <p-wrap :hasFooter="true">
      <view class="itemBox">
        <view class="itemTitle">
          请连接电极耗材和设备
        </view>
        <view class="itemTitle">
          ① 使用对应型号电极耗材
        </view>
        <view class="electrodeList">
          <view
            class="electrode"
            v-for="item in electrodeList"
            :key="item.type"
          >
            <view class="img">
              <image
                :src="urlImg+item.type.toLowerCase()+'_cover.png'"
                mode="widthFix"
              />
            </view>
            <view class="type">
              <view class="mode">
                {{ item.type }}
              </view>
              <view class="num">
                *{{ item.quantity }}
              </view>
            </view>
          </view>
        </view>
        <view class="itemTitle">
          ② 将连接线与电极片连接
          <image
            class="guide"
            :src="globalData.config.guideMaterial2"
            mode="widthFix"
          />
        </view>
        <view class="itemTitle">
          ③ 将连接线端口插入电极口
          <image
            class="guide"
            :src="globalData.config.guideMaterial3"
            mode="widthFix"
          />
        </view>
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
export default {
  data () {
    return {
      urlImg: this.libs.configProject.urlImg + 'compress/',
      electrodeList: [
        { type: 'a50', quantity: '1' },
        { type: 'c1770', quantity: '2' },
        { type: 'g2153', quantity: '1' }
      ],
      theme: `--theme-color:${this.globalData.config.theme} `
    }
  },
  async onLoad () {
    this.getWorkoutDetail()
  },
  methods: {
    async getWorkoutDetail () {
      this.globalData.workout = (await this.libs.request(this.libs.api.wyjkDevice.consumerElectronics.viewWorkoutDetail, { workoutId: this.globalData.workout.workoutId })).data
      this.electrodeList = JSON.parse(this.globalData.workout.optionalElectrodeImages)
      console.log('workoutDetail程序明细', this.electrodeList, this.globalData.workout)
    },
    nextStep () {
      uni.navigateTo({ url: '/bluetooth/paste' })
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
  .electrodeList {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .electrode {
      width: calc(50% - 20rpx);
      padding: 20rpx;
      margin: 20rpx 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      border: var(--border-normal);
      border-radius: var(--border-radius);
      .img {
        width: 80rpx;
        height: 80rpx;
        border-radius: var(--border-radius);
        background: var(--color-background);
      }
      .type {
        text-align: right;
        .num {
          font-size: var(--font-h5);
          color: var(--color-tips);
        }
      }
    }
  }
  .guide {
    width: 100%;
    padding-top: 20rpx;
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
