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
    <input
      class="phone"
      placeholder="请输入用户名"
      v-model="username"
      @input="error = ''"
    >
    <input
      class="phone"
      :password="true"
      placeholder="请输入密码"
      v-model="password"
      @input="error = ''"
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
    <!-- <view
      class="toggleLoginType"
      @click="toggleLoginType"
    >
      手机号登录
    </view> -->
  </view>
</template>

<script>
import CryptoJS from './crypto-js'
/*
    DES(Data Encryption Standard)和TripleDES是对称加密的两种实现。
    DES和TripleDES基本算法一致，只是TripleDES算法提供的key位数更多，加密可靠性更高。
    DES使用的密钥key为8字节，初始向量IV也是8字节。
    TripleDES使用24字节的key，初始向量IV也是8字节。
*/

export default {
  data () {
    return {
      error: '',
      username: this.libs.data.getStorage('userName') || '',
      password: '',
      config: this.globalData.config
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
    // uni.reLaunch({ url: '/scheme/edit' })
  },
  methods: {
    // des加密/解密 DES-EDE3-CBC
    des (message, key, iv, type = 'encrypt') {
      // let _key = CryptoJS.MD5(key).toString()
      // let _iv = CryptoJS.MD5(iv || key).toString()
      let crypto_key = CryptoJS.enc.Utf8.parse(key)
      let crypto_iv = CryptoJS.enc.Utf8.parse(iv.substr(0, 8))
      let _str = CryptoJS.TripleDES[type](message, crypto_key, {
        iv: crypto_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      if (type === 'encrypt') return _str.toString()
      if (type === 'decrypt') return _str.toString(CryptoJS.enc.Utf8)
    },
    async submit () {
      if (!this.username || !this.password) return this.error = '请输入' + (this.username ? '' : ' 用户名') + (this.password ? '' : ' 密码')
      let _arg = ['health10', '20230130']
      let password = this.des(this.password, ..._arg)
      let de = this.des(password, ..._arg, 'decrypt')
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
      uni.reLaunch({ url: '/login/loginPhone' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./login.scss";
</style>
