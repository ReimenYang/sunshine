<template>
  <view>
    <view class="headerTitle">
      选择{{ splice }}插口-电刺激部位
    </view>
    <radio-group
      class="radioGroup"
      @change="change"
    >
      <label
        class="label"
        :class="{selected: String(item.id) === String(tmpId)}"
        v-for="item in postionList"
        :key="item.id"
      >
        <image
          :src="item.imageUrl"
          mode="aspectFit"
          class="image"
        />
        <radio
          class="radio"
          :color="globalData.config.theme"
          :value="item.id"
          :checked="String(item.id) === String(tmpId)"
        />
        <text class="text">{{ item.imageName }}</text>
      </label>
    </radio-group>
    <view class="btnGroup fix">
      <view
        class="btn primary"
        @click="confirm"
      >
        确定选择
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    splice: {
      type: String,
      default: ''
    },
    postionId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tmpId: this.postionId,
      postionList: [{
        'id': 9,
        'name': '左下肢循环',
        'imageUrl': 'https://sapi.xinuowang.com:9000/product-public/consume/左下肢循环.png'
      }]
    }
  },
  created () {
    this.postionList = this.globalData.imageList.filter(item => item.imageType === 'position' && (this.splice[1] - 0) === item.imageChannel)
  },
  methods: {
    change (e) {
      let target = this.postionList.find(item => item.id === e.detail.value)
      this.tmpId = target.id
      console.log(target)
    },
    confirm () {
      this.$emit('onConfirm', this.tmpId - 0)
    }
  }
}
</script>
<style lang="scss" scoped>
.headerTitle {
  padding: 30rpx;
}
.radioGroup {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  .label {
    width: 45%;
    box-sizing: border-box;
    margin-bottom: 4%;
    padding-bottom: 15rpx;
    border: var(--border-normal);
    background-color: #fff;
    text-align: center;
    .image {
      opacity: 0.6;
    }
    .radio {
      transform: scale(0.7);
    }
    &.selected {
      border: 5rpx solid var(--theme-color);
      .image {
        opacity: 1;
      }
    }
  }
}
</style>
