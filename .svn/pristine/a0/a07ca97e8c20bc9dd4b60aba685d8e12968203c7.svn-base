<template>
  <view class="wrap">
    <view class="title">
      方案名称
    </view>
    <view class="schemeName">
      {{ schemeDetail.name }}
    </view>
    <view class="title">
      训练程序
    </view>
    <view class="workoutList">
      <xnw-item
        v-for="item in workoutList"
        :key="item.id"
        :info="item"
        @click="toReady(item)"
      />
    </view>
  </view>
</template>
<script>
export default {
  data () {
    return {
      schemeDetail: {},
      workoutList: []
    }
  },
  async onLoad (option) {
    this.schemeDetail = this.globalData.schemeList.find(item => item.id === (option.schemeId - 0)) || {}
    let phone = this.globalData.userInfo.phone
    let schemeId = this.schemeDetail.id
    let schemeStateList = (await this.libs.request(this.libs.api.ECirculation.scheme.getSchemeState, { phone, schemeId })).data
    let doneList = schemeStateList.filter(item => item.workoutState === 'Y').map(item => item.workloutId)

    this.schemeDetail.workoutList.forEach(item => {
      let note = ''
      if (doneList.includes(item.id)) note = '（今天已训练）'
      this.workoutList.push({
        ...item,
        title: item.name + note,
        tags: [{ txt: '训练' }],
        contents: [{
          txt: `训练时长 ${item.duration / 60}分钟`
        }, {
          txt: '程序描述 ' + item.description
        }]
      })
    })
  },
  methods: {
    toReady (target) {
      return uni.navigateTo({ url: '/pages/scheme/getReady?schemeId=' + this.schemeDetail.id + '&workloutId=' + target.id })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  min-height: 100vh;
  padding: 20rpx;
  background: #fff;
  .title {
    padding: 20rpx 0 0 0;
    font-size: var(--font-h4);
    color: var(--theme-color);
  }
  .schemeName {
    margin-bottom: 20rpx;
    font-size: var(--font-h3);
    line-height: 3;
    border-bottom: var(--border-normal);
  }
  .workoutList /deep/ .itemBox {
    margin-top: 20rpx;
    padding: 20rpx;
    position: relative;
    border-radius: var(--border-radius);
    background: var(--color-background);
    font-size: var(--font-h35);
    .title {
      font-size: var(--font-h3);
    }
    .tagBox {
      position: absolute;
      top: 30rpx;
      right: 0;
      .txt {
        padding: 0 40rpx;
        border-radius: 30rpx;
        font-size: var(--font-h4);
        line-height: 60rpx;
        color: var(--color-white);
        background: var(--theme-color);
      }
    }
    .contents {
      line-height: 1.5;
      color: var(--color-light);
    }
  }
}
</style>
