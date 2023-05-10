<template>
  <view>
    <p-downBLE
      v-if="showUpdate"
      :setting="setting"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
    />
    <view
      class="wrap"
      :style="theme"
      v-if="isNeed"
    >
      <view class="body">
        <view class="title">
          激活设备
        </view>
        <view class="note">
          请输入设备电池仓后盖标注的序列号码
        </view>
        <view
          class="from"
          v-if="showInput.realname"
        >
          <text class="iconfont icon-user" />
          <input
            type="text"
            placeholder="请输入用户名"
            v-model="userInfo.realname"
          >
        </view>
        <view
          class="from"
          v-if="showInput.sn"
        >
          <text class="iconfont icon-key" />
          <input
            type="text"
            placeholder="请输入设备序列号"
            v-model="userInfo.sn"
          >
        </view>
        <!-- <connect-ble /> -->
      </view>
      <view class="btn">
        <xnw-footer
          textConfirm="提交"
          :showCancel="false"
          @onConfirm="submit"
        />
      </view>
    </view>
  </view>
</template>

<script>
// import mixinBLE from '@/pages/index/mixinBLE.js'
import login from './login.js'
// import connectBle from '@/bluetooth/_connect'
import checkReady from '@/libs/uniInit'
export default {
  // mixins: [mixinBLE],
  // components: { connectBle },
  data () {
    return {
      userInfo: {},
      showInput: { realname: false, sn: false },
      isNeed: false,
      showUpdate: false,
      setting: {
        type: this.libs.configProject.projectName,
        showModal: 'dialog',
        from: 'app'
      },
      theme: `--theme-color:${this.globalData.config.theme} `
    }
  },
  async onLoad () {
    // uni.redirectTo({ url: '/scheme/index' })
    //  2022-9-14 需求跳过此页面
    this.init()
  },
  methods: {
    async init () {
      uni.showLoading({ title: '初始化...' })

      await checkReady()
      let userInfo = await login()
      if (!userInfo) return uni.showToast({ title: '登录失败', icon: 'none', duration: 2000 })
      // 检查用户信息
      // this.userInfo = this.globalData.userInfo
      // 优E康
      // this.isNeed = !this.userInfo.realname
      // 易循环
      // this.showInput = { realname: !this.userInfo.realname, sn: !this.userInfo.sn }
      // this.isNeed = Object.values(this.showInput).includes(true)
      // 检查更新信息
      this.setting = { ...this.globalData.updateAppConfig, ...this.setting }
      let {
        vision,
        lowest,
        lastest,
        isForce,
        showUpdate
      } = this.setting

      this.showUpdate = showUpdate
      console.log(
        lowest,
        lastest,
        vision,
        isForce,
        this.showUpdate
      )
      uni.hideLoading()
      if (!this.isNeed && !this.showUpdate && userInfo.statusCode !== 30002) return this.router()
    },
    onCancel () {
      this.showUpdate = false
      if (!this.isNeed) return this.router()
    },
    onConfirm () {
      this.libs.data.exit('退出并下载更新app')
    },
    async submit () {
      let { realname, sn } = this.userInfo
      console.log(realname, sn)
      if (!realname) return this.toast('请输入用户名')
      if (!sn) return this.toast('请输入设备序列号')
      this.globalData.userInfo = { ...this.userInfo, ...this.globalData.device }
      let res = await this.libs.request(
        this.libs.api.ECirculation.user.binding,
        this.globalData.userInfo
      )
      if (res.code !== 200) return
      return this.router()
    },
    router () {
      if (this.libs.configProject.userRole === 'hospital' && !this.globalData.userInfo) return uni.reLaunch({ url: '/login/loginPassword' })
      uni.reLaunch({ url: '/scheme/index' })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  height: 100vh;
  padding: 20rpx 60rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .body {
    .title {
      font-size: var(--font-h1);
    }

    .note {
      margin-bottom: 120rpx;
    }

    .from {
      height: 100rpx;
      padding-top: 20rpx;
      display: flex;
      align-items: center;
      border-bottom: var(--border-normal);

      input {
        flex: 1;
        padding: 20rpx;
      }
    }
  }
}
</style>
