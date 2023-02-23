<template>
  <view class="menu">
    <xnw-nav
      :list="menu.list"
      :defaultIndex="defaultIndex"
      :activeStyle="menu.activeStyle"
      @onClick="onClick"
    />
  </view>
</template>
<script>
export default {
  props: {
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    let list = this.libs.configProject.userRole === 'user' ?
      [
        { txt: '康复理疗', icon: 'yaoxiang', url: '/pages/scheme/index' },
        { txt: '训练记录', icon: 'baogao', url: '/pages/scheme/record' },
        // { txt: '健康资讯', icon: 'read', url: '/pages/scheme/index' },
        { txt: '联系我们', icon: 'dianhua', url: '/pages/index/contact' }
      ] : [
        { txt: '康复理疗', icon: 'yaoxiang', url: '/pages/scheme/index' },
        { txt: '方案管理', icon: 'baogao', url: '/pages/scheme/list' },
        { txt: '关于我们', icon: 'dianhua', url: '/pages/index/about' }
      ]
    // list[this.defaultIndex].icon += '-fill'
    return {
      menu: {
        list,
        activeStyle: `
        color: var(--theme-color);
        // font-weight: bold;
        `
      }
    }
  },
  methods: {
    onClick ({ url }) {
      console.log(url)
      uni.reLaunch({ url })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu {
  height: 140rpx;
  border-top: var(--border-normal);
  box-sizing: border-box;
  background-color: #fff;
  /deep/ .list .item {
    padding: 10rpx 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    color: var(--color-light);
    .iconfont {
      font-size: 48rpx;
    }
  }
}
</style>
