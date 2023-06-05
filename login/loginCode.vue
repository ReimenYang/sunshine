<template>
  <view class="wrap">
    <view class="title">
      <view class="row">
        <view class="appName">
          验证手机号
        </view>
        <view class="welcome">
          短信验证码已发送至 {{ phone.replace( /(\d{3})\d*(\d{4})/, '$1****$2' ) }}
        </view>
      </view>
    </view>
    <input
      class="phone"
      type="number"
      placeholder="请输入短信验证码"
      v-model="code"
      @input="error= ''"
    >
    <view class="error">
      {{ error }}
    </view>
    <view class="btn">
      <xnw-footer
        textConfirm="登录/注册"
        :showCancel="false"
        @onConfirm="submit"
      />
    </view>
    <view
      class="retry"
      :class="disable"
      @click="sendSms"
    >
      重新发送 {{ second }}
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      code: '',
      error: '',
      disable: '',
      phone: this.libs.data.getStorage('phone'),
      counter: null,
      second: 0
    }
  },
  async onLoad (option) {
    let _phone = option.phone
    let _verify = this.libs.data.verify.phone(_phone)
    if (!_verify) return
    this.phone = _phone
    this.sendSms()
  },
  methods: {
    async submit () {
      if (this.code.length !== 6) return this.error = '验证码不正确'
      let { code, message } = await this.libs.global.uniCloudApi({ apiName: 'verifySmsCode', phone: this.phone, code: this.code })
      this.error = message
      if (code !== 200) return
      this.libs.data.setStorage('phone', this.phone)
      uni.reLaunch({ url: '/pages/index/index' })
    },
    intervalSecond () {
      this.second = 60
      this.disable = 'disable'
      this.counter = setInterval(() => {
        this.second--
        if (0 < this.second) return
        clearInterval(this.counter)
        this.disable = this.second = ''
      }, 1000)
    },
    async sendSms () {
      if (this.disable) return
      let res = (await this.libs.global.uniCloudApi({ actionType: 'sendSms', phone: this.phone, templateId: '16018', action: '注册' }))
      if (res === 0) return this.intervalSecond()
      this.intervalSecond()
      this.toast(res.errMsg + res.errCode)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./login.scss";
</style>
