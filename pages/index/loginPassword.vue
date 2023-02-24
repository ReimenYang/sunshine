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
      placeholder="请输入用户名"
      v-model="username"
      @input="error= ''"
    >
    <input
      class="phone"
      :password="true"
      placeholder="请输入密码"
      v-model="password"
      @input="error= ''"
    >
    <view class="error">
      {{ error }}
    </view>
    <view class="btn">
      <xnw-footer
        textConfirm="登录"
        :showCancel="false"
        @onConfirm="submit"
      />
    </view>
    <view
      class="toggleLoginType"
      @click="toggleLoginType"
    >
      手机号登录
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      error: '',
      username: this.libs.data.getStorage('userName') || '',
      password: ''
    }
  },
  async onLoad () {
    let userInfo = this.libs.data.getStorage('userInfo')
    if (userInfo && new Date() - userInfo.timestamp > 1000 * 60 * 60 * 24 * 15) {
      uni.showModal({ content: '登录信息有效期已过，请重新登录' })
      this.libs.data.removeStorage('userInfo')
      userInfo = null
    }
    if (!userInfo) return
    this.globalData.userInfo = userInfo
    uni.reLaunch({ url: '/pages/index/index' })
    // uni.reLaunch({ url: '/pages/scheme/edit' })
  },
  methods: {
    async submit () {
      if (!this.username || !this.password) return this.error = '请输入' + (this.username ? '' : ' 用户名') + (this.password ? '' : ' 密码')
      let _arg = ['health10', '20230130']
      let password = this.libs.data.des(this.password, ..._arg)
      let de = this.libs.data.des(password, ..._arg, 'decrypt')
      console.log(password, de)
      let { data, code, errorMessage } = await this.request(this.api.ECirculation.user.loginByUsername, { username: this.username, password })
      if (code !== 200) return this.error = errorMessage
      data.realname = data.userName
      data.timestamp = new Date() - 0
      this.globalData.userInfo = data
      this.libs.data.setStorage('phone', data.phone)
      this.libs.data.setStorage('userName', this.username)
      this.libs.data.setStorage('userInfo', data)
      uni.reLaunch({ url: '/pages/index/index' })
      // this.toast('提交')
    },
    toggleLoginType () {
      uni.reLaunch({ url: '/pages/index/loginPhone' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./login.scss";
</style>
