<template>
  <view
    class="wrap bg"
    :style="theme"
  >
    <p-header title="关于我们" />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
      style="position: relative"
    >
      <view
        class="btnList"
        v-if="!modifyPassword"
      >
        <view
          class="btn"
          @click="toContact"
        >
          联系我们
        </view>
        <view
          class="btn"
          @click="modifyPassword = true"
        >
          修改密码
        </view>
        <view
          class="btn"
          @click="loginOut"
        >
          退出登录
        </view>
        <view class="btn">
          <firmware-update />
        </view>
      </view>
      <view
        class="setPassword"
        v-if="modifyPassword"
      >
        <xnw-from
          :config="configPassword"
          ref="configPassword"
        />
        <view class="btnGroup">
          <view
            class="btn"
            @click="setPassword"
          >
            确认修改
          </view>
        </view>
      </view>
    </p-wrap>
    <p-menu :defaultIndex="2" />
  </view>
</template>
<script>
import firmwareUpdate from '@/pages/index/_firmwareUpdate'
export default {
  components: { firmwareUpdate },
  data () {
    return {
      modifyPassword: false,
      configPassword: {
        data: [{
          key: 'oldPassword', title: '当前密码',
          input: { value: '', placeholder: '请输入', password: true }
        }, {
          key: 'newPassword', title: '新密码',
          input: { value: '', placeholder: '请输入', password: true }
        }, {
          key: 'newPasswordRepeat', title: '重复密码',
          input: { value: '', placeholder: '请输入', password: true }
        }]
      },
      theme: `--contactBg: url(${this.globalData.config.contactBg});--theme-color:${this.globalData.config.theme} `
    }
  },
  methods: {
    toContact () {
      uni.navigateTo({ url: '/pages/index/contact' })
    },
    async setPassword () {
      let params = this.$refs.configPassword.getFromData()
      let _error = ''
      this.configPassword.data.forEach(item => {
        if (_error) _error += '、'
        if (item.input.value.length < 5) return _error += item.title
      })
      if (_error) _error += '不能少于6位'
      if (!_error && params.newPassword !== params.newPasswordRepeat) _error = '两次填写的密码不一致'
      if (_error) return this.toast(_error)
      let _arg = ['health10', '20230130']
      params.oldPassword = this.libs.data.des(params.oldPassword, ..._arg)
      let { errorMessage } = await this.request(this.api.ECirculation.user.modifyPassword, params)
      this.toast(errorMessage || '密码修改成功')
      this.modifyPassword = false
    },
    loginOut () {
      this.libs.data.removeStorage('userInfo')
      this.globalData.userInfo = null
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
  background: var(--contactBg) no-repeat top center/100%;
}
.wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .btnList,
  .setPassword {
    height: 50vh;
    margin: 200rpx 20rpx 20rpx;
    padding: 50rpx;
    text-align: center;
    border-radius: var(--border-radius);
  }
  .btnList {
    .btn {
      margin: 30rpx;
      line-height: 100rpx;
      border: var(--border-normal);
      border-radius: inherit;
      background-color: #fff;
    }
  }
  .setPassword {
    background-color: #fff;
    .btn {
      margin-top: 100rpx;
      line-height: 100rpx;
    }
  }
}
</style>
