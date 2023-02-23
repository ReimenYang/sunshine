<template>
  <view
    class="wrap indexBg"
    :style="{'--indexBg': `url(${globalData.config.indexBg})`,'--theme-color':globalData.config.theme}"
  >
    <p-header :title="globalData.config.appName" />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
    >
      <view class="userInfo">
        <xnw-item
          :info="userInfo"
          v-if="userInfo.title"
        >
          <view
            v-if="bleState.paired"
            slot="footer"
            @click="toConnect('navigateTo')"
          >
            <view class="toConnect">
              更换设备
            </view>
            {{ userInfo.footer }}
          </view>
        </xnw-item>
      </view>
      <view
        class="unPaired"
        v-if="!bleState.paired"
        @click="toConnect()"
        :style="setBg()"
      >
        <view
          v-if="device.name"
          class="deviceName"
        >
          设备号：{{ device.name }}
        </view>
      </view>
      <view
        class="workout"
        v-if="bleState.paired"
      >
        <view class="itemBoxTitle">
          推荐方案
        </view>
        <view class="workoutList">
          <xnw-item
            v-for="item in workoutList"
            :key="item.workoutId"
            :info="item"
            @click="toReady(item)"
          >
            <view
              slot="footer"
              v-if="item.todayState === 'Y'"
            >
              <view class="today">
                <view class="after">
                  √<br>今日
                </view>
              </view>
            </view>
          </xnw-item>
        </view>
      </view>
      发送长度：<input
        type="number"
        v-model="l"
      >K
      发送间隔：<input
        type="number"
        v-model="t"
      >ms
      <view class="btnGroup">
        <view
          @click="test"
          class="btn"
        >
          按队列同步发送
        </view>
        <view
          @click="testB"
          class="btn"
        >
          加序号异步发送
        </view>
        <view
          @click="testC"
          class="btn"
        >
          一次性发送
        </view>
      </view>
    </p-wrap>
    <p-menu :defaultIndex="0" />
  </view>
</template>
<script>
import mixinBLE from '@/pages/index/mixinBLE.js'
import mixinWorkoutList from '@/pages/index/mixinWorkoutList.js'
export default {
  mixins: [mixinBLE, mixinWorkoutList],
  data () {
    return {
      userInfo: {
        post: '/static/face.png'
      },
      from: '',
      RecordId: 0,
      l: 100,
      t: 10
    }
  },
  async onLoad (option) {
    this.from = option.from
  },
  onHide () {
    delete this.globalData.pageInit
    delete this.globalData.handlePair
  },
  async onShow () {
    this.globalData.pageInit = this.init
    this.globalData.handlePair = this.pageHandlePair

    let _hour = new Date().getHours()
    if (_hour <= 5) this.userInfo.title = '凌晨好！'
    if (6 <= _hour && _hour <= 10) this.userInfo.title = '早上好！'
    if (11 <= _hour && _hour <= 13) this.userInfo.title = '中午好！'
    if (14 <= _hour && _hour <= 17) this.userInfo.title = '下午好！'
    if (18 <= _hour && _hour <= 19) this.userInfo.title = '傍晚好！'
    if (20 <= _hour) this.userInfo.title = '晚上好！'

    this.userInfo.contents = [
      {
        // txt: this.globalData.userInfo.phone.replace(
        //   /(\d{3})\d*(\d{4})/,
        //   '$1****$2'
        // )
        txt: this.globalData.userInfo.realname
      }
    ]
    console.log('首页show')
    // 20221019 需求 减少请求
    await this.getWorkoutList()
    this.pageHandlePair(this.bleState.paired)
  },
  methods: {
    async init () {
      // this.device = this.globalData.device = this.libs.data.getStorage('device')
      // 获取上次使用的设备
      // console.log('首页init')
      // this.pageHandlePair(this.bleState.paired)

      // 防止死循环 自动连接
      if (!this.from && this.device.name) return await this.toConnect()
    },
    pageHandlePair (boolean) {
      // this.paired = boolean
      let str = '点击连接设备'
      console.log('首页handlePair', this.globalData.device, boolean)
      if (this.globalData.device && this.globalData.device.name)
        str =
          '设备 ' +
          this.globalData.device.name +
          (boolean ? '已连接 ' : '未连接 ')
      this.$set(this.userInfo, 'footer', str)
      if (boolean) this.getRecord()
    },
    async toConnect (type) {
      // 从未连接设备或跳转
      if (type === 'navigateTo' || !this.device.name)
        return uni.navigateTo({ url: '/pages/bluetooth/connect' })
      // 曾连接，未配对，先尝试连接，连接失败进行跳转
      let _connected = this.bleState.paired ? {} : await this.connectDevice()
      console.log('连接情况', _connected)
      if (!this.bleState.paired && _connected.statusCode !== 200)
        return uni.navigateTo({ url: '/pages/bluetooth/connect' })
      // if(this.globalData.paired) return this.getRecord()
    },
    async toReady (workout) {
      // 第一次连接
      // if (!this.device.name) return this.toast('未绑定设备')
      // if (!this.device.name) return uni.navigateTo({ url: '/pages/bluetooth/connect?nextTo=/pages/bluetooth/paste' })
      // 曾连接，未配对，尝试配对
      // if (!this.bleState.paired) await this.connectDevice()
      // 尝试失败
      // if (!this.bleState.paired) return
      // this.globalData.workout = (await this.libs.request(this.libs.api.wyjkDevice.consumerElectronics.viewWorkoutDetail, { workoutId: workout.workoutId })).data

      this.globalData.workout = workout
      console.log('workoutDetail程序明细', this.globalData.workout)
      // 此时可能处于匹配状态
      uni.navigateTo({ url: '/pages/bluetooth/paste' })
    },
    setBg () {
      if (this.device.name)
        return 'background-image: url("/static/neverLink.png")'
      return 'background-image: url("/static/unLink.png")'
    },
    test () {
      let l = this.l
      let length = 5 * 10 * l
      let time = new Date()
      this.libs.global.ble.BaseBleModule.writeTime = this.t
      uni.showLoading({ title: `开始发送长度为 ${l}k 的数据` })
      this.libs.global.ble.BaseBleModule.commandMQ(Array.apply(null, { length }).map((n, i) => 'xxxxxxxxxxxxxxxxxxxx'.replace(/x/img, String(i).slice(-1))).join(''))
      let commandID = this.libs.global.ble.BaseBleModule.commandHistory.slice(-1)[0].id
      this.commandCallback(commandID, () => {
        this.libs.global.ble.BaseBleModule.writeTime = 100
        uni.hideLoading()
        uni.showModal({ content: `完成发送，用时 ${(new Date() - time) / 1000} 秒` })
      })
    },
    testB () {
      let length = 5 * 10
      console.log('异步发送', length)
      Array.apply(null, { length }).forEach((n, i) => {
        let value = ('00000' + i).slice(-4) + ',xxxxxxxxxxxxxx'.replace(/x/img, String(i).slice(-1))
        let buffer = new ArrayBuffer(value.length)
        let dataView = new DataView(buffer)
        for (let i = 0; i < value.length; i++) {
          dataView.setUint8(i, value.charAt(i).charCodeAt())
        }
        value = dataView.buffer
        uni.writeBLECharacteristicValue({
          deviceId: 'F0:C7:7F:73:68:20',
          serviceId: '0000FFB0-0000-1000-8000-00805F9B34FB',
          characteristicId: '0000ffb2-0000-1000-8000-00805f9b34fb',
          value,
          // success: function (e) {
          //   console.log('write characteristics success: ' + JSON.stringify(e))
          // },
          fail: function (e) {
            console.log(i, '发送失败')
          }
        })
      })
    },
    testC () {
      let length = 5 * 10
      let value = Array.apply(null, { length }).map((n, i) => 'xxxxxxxxxxxxxxxxxxxx'.replace(/x/img, String(i).slice(-1))).join('')
      console.log('一次性发送', value.length)
      let buffer = new ArrayBuffer(value.length)
      let dataView = new DataView(buffer)
      for (let i = 0; i < value.length; i++) {
        dataView.setUint8(i, value.charAt(i).charCodeAt())
      }
      value = dataView.buffer

      uni.writeBLECharacteristicValue({
        deviceId: 'F0:C7:7F:73:68:20',
        serviceId: '0000FFB0-0000-1000-8000-00805F9B34FB',
        characteristicId: '0000ffb2-0000-1000-8000-00805f9b34fb',
        value,
        // success: function (e) {
        //   console.log('write characteristics success: ' + JSON.stringify(e))
        // },
        fail: function (e) {
          console.log('一次性发送失败' + JSON.stringify(e))
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /deep/ .wrap {
    padding: 20rpx;
  }
  &.indexBg {
    background: var(--indexBg) no-repeat top center/100%;
  }
  .userInfo {
    .toConnect {
      float: right;
      color: var(--theme-color);
    }
    /deep/ .itemBox {
      padding: 20rpx;
      box-sizing: border-box;
      border-radius: var(--border-radius);
      background: #fff;
      line-height: 2;
      .post {
        width: 150rpx;
        height: 150rpx;
        padding: 10rpx;
        box-sizing: border-box;
        border-radius: 50%;
      }
      .title {
        font-size: var(--font-h3);
      }
      .infoFooter {
        padding: 20rpx;
        border-top: var(--border-normal);
        color: #999;
      }
    }
  }
  .unPaired {
    width: 80vw;
    height: 80vw;
    margin: 60rpx auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: no-repeat center/cover;
    font-size: var(--font-h3);
    text-align: center;
    line-height: 1.5;
    .deviceName {
      margin-top: 100%;
      padding-top: 100rpx;
      color: var(--theme-color);
    }
  }
  .workoutList {
    .today {
      --tab-height: -3em;
      width: 0;
      height: 0;
      margin-top: var(--tab-height);
      position: absolute;
      right: 0;
      border: calc(var(--tab-height) / -2) solid;
      border-color: transparent var(--theme-color) var(--theme-color)
        transparent;
      border-radius: 0 0 var(--border-radius);
      color: #fff;
      white-space: nowrap;
      text-align: right;
      .after {
        position: absolute;
        top: calc(var(--tab-height) / 3);
        right: calc(var(--tab-height) / 2);
        z-index: 2;
        font-size: var(--font-h4);
      }
    }
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
    }
  }
}
</style>
