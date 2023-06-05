<template>
  <view class="wrap">
    <view class="title">
      <image
        class="logo"
        :src="config.logo"
      />
      <view class="row">
        <view class="welcome">
          欢迎使用
        </view>
        <view class="appName">
          {{ config.appName }}App
        </view>
      </view>
    </view>
    <!-- #ifndef MP-WEIXIN -->
    <input
      class="phone"
      type="number"
      placeholder="请输入手机号"
      v-model="phone"
      @input="error= ''"
    >
    <view class="error">
      {{ error }}
    </view>
    <view class="btn">
      <xnw-footer
        textConfirm="下一步"
        :showCancel="false"
        @onConfirm="submit"
      />
    </view>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <button
      type="default"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
      class="authorizeBtn"
    >
      <image
        class="iconBtn"
        src="http://download.health10.cn/ECirculation/mpWeixinStatic/weixinLogo.png"
      />
      微信授权登录
    </button>
    <!-- #endif -->
    <!-- <view
      class="toggleLoginType"
      @click="toggleLoginType"
    >
      密码登录
    </view> -->
  </view>
</template>

<script>
export default {
  data () {
    return {
      error: '',
      phone: '',
      config: this.globalData.config
    }
  },
  async onLoad () {
    let _phone = this.libs.data.getStorage('phone')
    let _verify = this.libs.data.verify.phone(_phone)
    if (_verify) this.phone = _phone
  },
  methods: {
    async getPhoneNumber (e) {
      let detail = await this.request(this.api.ECirculation.wx.getUserPhone, { code: e.detail.code })
      let phone = detail.data
      let _verify = this.libs.data.verify.phone(phone)
      if (!_verify) return this.toast('手机号码不正确')
      this.libs.data.setStorage('phone', phone)
      uni.reLaunch({ url: '/pages/index/index' })
    },
    async submit () {
      let _verify = this.libs.data.verify.phone(this.phone)
      if (!_verify) return this.error = '手机号码填写不正确'
      uni.navigateTo({ url: '/login/loginCode?phone=' + this.phone })
    },
    toggleLoginType () {
      uni.reLaunch({ url: '/login/loginPassword' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./login.scss";
.authorizeBtn {
  margin-top: 100rpx;
  &:after {
    border: none;
  }
  .iconBtn {
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
    vertical-align: middle;
  }
}
</style>
