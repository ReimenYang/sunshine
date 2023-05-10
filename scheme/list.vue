<template>
  <view
    class="wrap"
    :style="theme"
  >
    <p-wrap :hasFooter="true">
      <view class="btnGroup">
        <view
          class="btn primary"
          @click="toEdit()"
        >
          新增方案
        </view>
      </view>
      <view
        class="emptyNotice"
        v-if="!workoutList.length"
      >
        暂无记录
      </view>
      <view
        class="workoutList"
        v-if="workoutList.length"
      >
        <xnw-item
          v-for="item in workoutList"
          :key="item.workoutId"
          :info="item"
          @click="toEdit(item)"
        >
          <view slot="footer">
            <view
              class="delete"
              @click.stop="toDel(item)"
            >
              删除
            </view>
          </view>
        </xnw-item>
      </view>
    </p-wrap>
    <p-menu :defaultIndex="1" />
  </view>
</template>
<script>
import mixinWorkoutList from '@/pages/index/mixinWorkoutList.js'
export default {
  mixins: [mixinWorkoutList],
  data () {
    return {
      theme: `--theme-color:${this.globalData.config.theme} `
    }
  },
  async onShow () {
    await this.init()
  },
  methods: {
    async init () {
      await this.getWorkoutList()
      this.workoutList = JSON.parse(JSON.stringify(this.globalData.workoutList))
      this.workoutList.forEach(item => { item.tags = [{ txt: '编辑' }] })
    },
    async toEdit (workout) {
      this.globalData.workoutEdit = workout || {
        channelList: [],
        name: '',
        description: '',
        duration: 1800
      }
      // console.log('workoutDetail程序明细', this.globalData.workout)
      // 此时可能处于匹配状态
      uni.navigateTo({ url: '/scheme/edit' })
    },
    async toDel (workout) {
      console.log('删除', workout)
      uni.showModal({
        content: `删除后不可恢复，确定要删除${workout.name}方案吗？`,
        success: async (res) => {
          if (res.cancel) return
          let { errorMessage } = await this.request(this.api.ECirculation.scheme.deleteScheme, { id: workout.id })
          if (!errorMessage) await this.init()
        }
      })
      // this.globalData.workout = workout
      // console.log('workoutDetail程序明细', this.globalData.workout)
      // 此时可能处于匹配状态
      // uni.navigateTo({ url: '/bluetooth/paste' })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  height: 100vh;
  .btnGroup {
    margin: 50rpx;
  }
  .workoutList {
    /deep/ .itemBox {
      margin-bottom: 20rpx;
      position: relative;
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
          color: var(--theme-color);
          border: var(--border-style);
        }
      }

      .contents {
        line-height: 1.5;
        color: var(--color-light);
      }
      .delete {
        position: absolute;
        top: 150rpx;
        right: 20rpx;
        padding: 0 40rpx;
        border-radius: 30rpx;
        font-size: var(--font-h4);
        line-height: 60rpx;
        color: var(--theme-color);
        border: var(--border-style);
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
