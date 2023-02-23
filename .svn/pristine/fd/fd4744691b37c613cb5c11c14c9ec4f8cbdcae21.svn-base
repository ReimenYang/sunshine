<template>
  <view
    class="wrap"
    :style="{'--theme-color':globalData.config.theme}"
  >
    <p-wrap :hasFooter="true">
      <view
        class="recordList"
        v-if="recordList.length"
      >
        <block
          v-for="item in recordList"
          :key="item.id"
        >
          <view
            class="recordYear"
            v-if="item.showYear"
          >
            {{ item.year }}年
          </view>
          <view class="item">
            <view class="datetime">
              <view class="date">
                {{ item.date }}
              </view>
              <view class="time">
                {{ item.time }}
              </view>
            </view>
            <view class="info">
              <view class="schemeName">
                {{ item.workout }}
              </view>
              <view class="workoutName">
                训练时长 {{ Math.floor(item.duration) }}min
              </view>
            </view>
          </view>
        </block>
      </view>
      <view
        class="emptyNotice"
        v-if="!recordList.length"
      >
        暂无记录
      </view>
    </p-wrap>
    <p-menu :defaultIndex="1" />
  </view>
</template>
<script>
export default {
  data () {
    return {
      recordList: []
    }
  },
  async onShow () {
    this.recordList = (await this.libs.request(this.libs.api.ECirculation.treatment.getTreatmentData, { phone: this.globalData.userInfo.phone, pageSize: 1000 })).data
    console.log('进入记录', this.recordList)
    this.recordList.forEach(item => {
      let _data = item.startDateTime || item.treatementDate
      let [year, month, day, hour, minute] = _data.replace(/[-|:]/img, ' ').split(' ')
      item.fullDate = this.libs.data.dateIOSFormat(_data)
      item.year = year
      item.date = month + '月' + day + '日'
      item.time = hour + ':' + minute
      if (!item.id) item.id = item.fullDate
    })
    this.recordList.sort((a, b) => b.fullDate - a.fullDate)
    let years = this.libs.array.unique(this.recordList.map(item => item.year))
    let showYear = years.map(year => Math.max.apply(null, this.recordList.filter(item => item.year === year).map(item => item.fullDate)))
    this.recordList.forEach(item => item.showYear = showYear.includes(item.fullDate))
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  height: 100vh;

  .recordList {
    padding: 20rpx;

    .recordYear {
      padding: 30rpx 0;
      font-size: var(--font-h3);
    }

    .item {
      display: flex;
      margin-bottom: 20rpx;
      padding: 40rpx;
      border-radius: var(--border-radius);
      background: #fff;
      font-size: var(--font-h35);
      line-height: 1.5;

      .datetime {
        width: 180rpx;
        margin-right: 40rpx;
        border-right: var(--border-normal);

        .date {
          color: var(--theme-color);
        }
      }

      .workoutName {
        color: var(--color-tips);
        word-spacing: 0.5em;
      }
    }
  }

  .emptyNotice {
    padding: 60rpx 0;
    text-align: center;
    line-height: 2;
    color: var(--color-light);
  }
}
</style>
