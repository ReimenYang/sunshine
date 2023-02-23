<template>
  <view class="themeBg wrap">
    <p-header
      backIcon="show"
      title="准备训练"
    />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
    >
      <uni-steps
        :options="steps"
        activeColor="#fff"
        :active="stepsActive"
        class="steps"
      />
      <block v-if="stepsActive===0">
        <connect
          :userInfo="userInfo"
          :schemeDetail="schemeDetail"
          :workoutDetail="workoutDetail"
        />
      </block>
      <block v-if="stepsActive===1">
        <view class="item">
          <view class="itemTitle">
            <!-- 通道{{ workoutDetail.imageList[swiperIndex].channel }} -->
            插口{{ workoutDetail.imageList[swiperIndex].splice }}
            ：请按示意图贴片
          </view>
          <swiper
            class="swiper"
            :indicatorDots="true"
            :current="swiperIndex"
            @change="swiperChange"
          >
            <swiper-item
              v-for="item in workoutDetail.imageList"
              :key="item.id"
            >
              <image
                :src="item.imageUrl"
                class="swiperImg"
              />
            </swiper-item>
          </swiper>
        </view>
      </block>
      <block v-if="stepsActive===2">
        <view class="item">
          <view class="itemTitle">
            请设置训练时长
          </view>
          <view class="name time">
            <uni-number-box
              v-model="time"
              :min="1"
              :max="180"
              :step="1"
              @change="timeChange"
            />
          </view>
        </view>
      </block>
      <block v-if="stepsActive===3">
        <view
          v-for="item in channelPhase"
          :key="String(item.channel)+ String(item.NumPhase)"
          v-show="item.active"
        >
          <view
            class="item"
            v-if="channelPhase.length>1"
          >
            通道{{ item.channel }}
            阶段{{ item.NumPhase }}
            刺激强度
          </view>
          <view class="item">
            <view class="itemTitle">
              插口一：
            </view>
            <view class="name splice">
              <uni-number-box
                v-model="item.left"
                :min="0"
                :max="10"
                :step="0.5"
                @change="n=>spliceChange(n,'left')"
              />
            </view>
          </view>
          <view class="item">
            <view class="itemTitle">
              插口二：
            </view>
            <view class="name splice">
              <uni-number-box
                v-model="item.right"
                :min="0"
                :max="10"
                :step="0.5"
                @change="n=>spliceChange(n,'right')"
              />
            </view>
          </view>
          <view class="note">
            开始训练后，还需要调整刺激强度时，请在设 备直接进行调整
          </view>
        </view>
      </block>

      <button @click="setRecord">
        设置记录
      </button>
      <button @click="getRecord">
        获取记录
      </button>
      <button @click="clearRecord">
        清除记录
      </button>
      <view
        style="padding:20px 10px"
        v-for="(item,i) in log"
        :key="i"
      >
        {{ item }}
      </view>
    </p-wrap>
    <view class="btn">
      <xnw-footer
        v-if="showNext()"
        textConfirm="下一步"
        :showCancel="false"
        @onConfirm="nextStep()"
      />
      <xnw-footer
        v-if="stepsActive===1"
        :textConfirm="`下一张（${swiperIndex+1}/${workoutDetail.imageList.length}）`"
        :showCancel="false"
        @onConfirm="swiperNext"
      />
      <xnw-footer
        v-if="stepsActive===3"
        :textConfirm="`${getChannelPhaseNextIndex()===channelPhase.length?'开始训练':'下一个'}（${getChannelPhaseNextIndex()}/${channelPhase.length}）`"
        :showCancel="false"
        @onConfirm="channelPhaseNext"
      />
    </view>
  </view>
</template>
<script>
import workoutData from '@/libs/global/ble/BioStim/workoutData.js'
import connect from './_connect'
import mixinBLE from '@/pages/index/mixinBLE.js'
export default {
  mixins: [mixinBLE],
  components: { connect },
  data () {
    return {
      steps: [{ title: '连接设备' }, { title: '贴电极片' }, { title: '训练时长' }, { title: '调试强度' }],
      stepsActive: 0,
      userInfo: this.globalData.userInfo,
      schemeDetail: {},
      workoutDetail: {},
      channelPhase: [],
      swiperIndex: 0,
      time: 0,
      spliceReady: false,
      log: []
    }
  },
  async onLoad (option) {
    this.globalData.log = this.log
    console.log('1', workoutData.data)
    this.schemeDetail = this.globalData.schemeList.find(item => item.id === (option.schemeId - 0)) || {}
    console.log('2', this.schemeDetail)
    if (!this.schemeDetail.workoutList || !this.schemeDetail.workoutList.length) return this.toast('程序加载错误！')
    console.log('3')
    // 多通道需要调整数据结构
    this.workoutDetail = this.schemeDetail.workoutList.find(item => item.id === (option.workloutId - 0)) || {}
    // 临时处理开始
    this.workoutDetail = workoutData.data[0]
    this.workoutDetail.imageList = [{
      'id': 1,
      'workoutId': 256,
      'channel': 1,
      'splice': 1,
      'imageUrl': 'https://sapi.xinuowang.com:9000/wyjk-bleapp/original/3bdf6a83870745d98878e427b49d5492.jpg,https://sapi.xinuowang.com:9000/wyjk-bleapp/original/9c3cb966cfa6408f8ded9a479440ace3.jpg,https://sapi.xinuowang.com:9000/wyjk-bleapp/original/d6f71af620fa4c3399e2620896c05cbf.jpg'
    }]
    this.workoutDetail.phaseList = this.workoutDetail.workoutphaselist
    this.workoutDetail.duration = 60
    // 多通道
    if (this.globalData.isNewDevice === 'Y') {
      this.workoutDetail.initcommand = 'DATA:m,1,1,0,60,170\\r\\n\\0'
      this.workoutDetail.workoutphaselist[0].phasecommand = 'DATA:p,1,1,1,70,500,0,1,0,1,687\\r\\n\\0'
      console.log('多通道开启', this.workoutDetail)
    }
    // 临时处理结束
    console.log('程序初始化', this.workoutDetail.initcommand)
    if (!this.workoutDetail.initcommand) {
      this.toast('程序初始化指令错误！')
      return uni.navigateBack()
    }
    let { statusCode } = await this.connectDevice(this.workoutDetail)
    if (statusCode !== 200) uni.navigateBack()
    /**
     * 概念释义
     * 通道（channel）：一台设备有n个通道，通道下会有n个插口，同一个通道下的插口会输出相同波形
     * 插口（splice）：设备上的物理插口，同一通道下的多个插口波形一直，工作电流可以不同
     * 贴片示意图（imageUrl）：同一个插口可能会有多张贴片示意图
     */
    if (this.workoutDetail.imageList) {
      this.workoutDetail.imageList
        .sort((a, b) => a.sep - b.sep)
        .sort((a, b) => a.splice - b.splice)
        .sort((a, b) => a.channel - b.channel)
    }
    console.log('获取通道阶段数据', this.workoutDetail.phaseList)
    // 获取通道阶段数据
    this.channelPhase = this.workoutDetail.phaseList
      .map(item => item.phasecommand)
      .map(item => {
        // 临时处理
        // let [, channel, NumPhase] = item.split(',')
        console.log('阶段数据', item)
        return { channel: 1, NumPhase: item.seqno, left: 0, right: 0, active: false }
      })
      .sort((a, b) => a.NumPhase - b.NumPhase)
      .sort((a, b) => a.channel - b.channel)
    this.channelPhase[0].active = true

    this.time = this.workoutDetail.duration / 60

    console.log('准备训练', this.time, this.schemeDetail, this.workoutDetail, this.channelPhase)
  },
  methods: {
    nextStep (channel) {
      switch (this.stepsActive) {
        case 2:
          uni.showLoading({
            title: '连接中...',
            mask: true
          })
          if (this.globalData.isNewDevice === 'Y' && !channel) channel = 1
          this.sendInitCmd(this.workoutDetail, this.workTime, channel)
          break
      }
      this.stepsActive++
    },
    showNext () {
      switch (this.stepsActive) {
        case 0:
          return true
        case 1:
          return false
        case 2:
          return true
        case 3:
          uni.hideLoading()
          return false
        default:
          return true
      }
    },
    swiperNext () {
      if (this.swiperIndex + 1 < this.workoutDetail.imageList.length) return this.swiperIndex++
      this.stepsActive++
    },
    swiperChange (e) {
      if (e.detail.current < this.workoutDetail.imageList.length) this.swiperIndex = e.detail.current
    },
    getChannelPhaseNextIndex () {
      return this.channelPhase.findIndex(item => item.active) + 1
    },
    channelPhaseNext () {
      let index = this.getChannelPhaseNextIndex()
      let { left, right } = this.channelPhase[index - 1]
      this.spliceReady = (left || right) > 0
      console.log(this.channelPhase[index - 1], left, right, (left || right) > 0, this.spliceReady)
      if (!this.spliceReady) return this.toast('请设置刺激强度')
      if (index >= this.channelPhase.length) return this.starScheme()
      this.channelPhase.forEach(item => item.active = false)
      this.channelPhase[index].active = true
    },
    timeChange (time) {
      console.log(time)
      return this.setWorkTime(time)
    },
    spliceChange (n, side) {
      console.log(n, side)
      let channelPhase = this.channelPhase.find(item => item.active) || {}
      let left = channelPhase.left = channelPhase.left - 0
      let right = channelPhase.right = channelPhase.right - 0
      this.spliceReady = (left || right) > 0
      switch (side) {
        case 'left':
          if (n < left) this.leftMinus()
          if (left < n) this.leftPlus()
          break
        case 'right':
          if (n < right) this.rightMinus()
          if (right < n) this.rightPlus()
          break
      }
      channelPhase[side] = n
    },
    starScheme () {
      this.startTreatment()
      // let option = {
      //   time: this.time,
      //   workoutName: this.workoutDetail.name,
      //   schemeName: this.schemeDetail.name
      // }
      // uni.navigateTo({ url: '/pages/bluetooth/running?' + this.libs.object.paramsToKeyValue(option) })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;
  /deep/ {
    .uni-steps {
      margin-bottom: 60rpx;
      .uni-steps__row-title {
        padding: 30rpx 0;
        font-size: var(--font-h4);
      }
      .uni-icons {
        font-size: var(--font-h3) !important;
      }
    }
    .uni-numbox {
      width: 400rpx;
      height: 100rpx;
      line-height: 100rpx;
      .uni-numbox__minus,
      .uni-numbox__plus {
        width: 100rpx;
        height: 100rpx;
      }
      .uni-numbox--text {
        font-size: 60rpx;
      }
      .uni-numbox__value {
        width: 200rpx;
        height: 100rpx;
        font-size: 50rpx;
      }
    }
  }
  .swiper {
    height: 133vw;
    .swiperImg {
      width: 100%;
      height: 100%;
    }
  }
  .time,
  .splice {
    padding: 100rpx 0;
    display: flex;
    justify-content: center;
  }
  .time::after {
    content: "分钟";
    margin-left: 20rpx;
  }
  .btn {
    height: 140rpx;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    border-top: var(--border-normal);
    background: #fff;
  }
  .item {
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: var(--border-radius);
    background: #fff;
    font-size: var(--font-h35);
    line-height: 3;
    .itemTitle {
      font-size: var(--font-h4);
      line-height: 1.5;
      color: var(--theme-color);
    }
    .itemBorder {
      margin: 20rpx 0;
      border-bottom: var(--border-normal);
    }
  }
  .note {
    padding: 20rpx;
    color: var(--color-light);
  }
}
</style>
