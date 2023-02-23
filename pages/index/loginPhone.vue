<template>
  <view class="wrap">
    <view class="title">
      <image
        class="logo"
        :src="globalData.config.logo"
      />
      <view class="row">
        <view class="welcome">
          欢迎使用
        </view>
        <view class="appName">
          {{ globalData.config.appName }}App
        </view>
      </view>
    </view>
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
    <view
      class="toggleLoginType"
      @click="toggleLoginType"
    >
      密码登录
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      error: '',
      phone: ''
    }
  },
  async onLoad () {
    let _phone = this.libs.data.getStorage('phone')
    let _verify = this.libs.data.verify.phone(_phone)
    if (_verify) this.phone = _phone
  },
  methods: {
    async submit () {
      let _verify = this.libs.data.verify.phone(this.phone)
      if (!_verify) return this.error = '手机号码填写不正确'
      this.libs.data.setStorage('phone', this.phone)
      uni.navigateTo({ url: '/pages/index/loginCode' })
    },
    toggleLoginType () {
      uni.reLaunch({ url: '/pages/index/loginPassword' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./login.scss";
</style>
