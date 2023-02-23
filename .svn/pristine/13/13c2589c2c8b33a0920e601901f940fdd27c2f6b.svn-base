<template>
  <view
    class="connectBox"
    :style="{'--theme-color':globalData.config.theme}"
  >
    <view class="itemBoxTitle">
      <view
        class="titleLoading"
        v-if="bleState.searching"
      >
        <image
          class="loading"
          src="@/static/loading.png"
          mode="widthFix"
        />搜索中...
      </view>
      可连接设备
    </view>
    <view class="deviceList">
      <view
        :class="{itemBox:true,deviceItem:true,isCheck:item.isCheck}"
        v-for="item in BioStimBleModule.deviceList"
        :key="item.name"
        @click="select(item)"
      >
        {{ item.name }}
        <text
          v-if="item.isCheck"
          class="icon-check iconfont"
        />
      </view>
      <view
        class="emptyNotice"
        v-if="!BioStimBleModule.deviceList.length"
        @click="bleSearch"
      >
        找不到设备<br>
        1.请确认手机蓝牙处于打开状态<br>
        2.检查设备是否已经开机<br>
        3.点击“查找设备”重新查找
      </view>
      <button
        class="refresh"
        @click="bleSearch"
      >
        查找设备
      </button>
    </view>
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
export default {
  mixins: [mixinBLE],
  // async created () {
  // this.bleSearch()
  // },
  beforeDestroy () { this.stopSearch() },
  methods: {
    select (item) {
      this.selectDevice(item)
      this.$emit('onSelect')
    }
  }
}
</script>
<style lang="scss" scoped>
.connectBox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .titleLoading {
    position: absolute;
    right: 20rpx;
    font-size: var(--font-h5);
  }
  .loading {
    width: 36rpx;
    margin-right: 10rpx;
    vertical-align: middle;
    animation: rotate 2s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .deviceList {
    .deviceItem {
      padding: 40rpx 20rpx;
      color: #666;
      display: flex;
      justify-content: space-between;
      &.isCheck {
        color: #333;
        font-weight: bold;
        .iconfont {
          width: 1.5em;
          height: 1.5em;
          line-height: 1.5;
          text-align: center;
          border-radius: 50%;
          color: #fff;
          background: var(--theme-color);
        }
      }
    }
    .emptyNotice {
      padding: 60rpx 0;
      line-height: 2;
      color: var(--color-light);
    }
    .refresh {
      margin-top: 40rpx;
    }
  }
}
</style>
