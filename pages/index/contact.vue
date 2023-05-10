<template>
  <view
    class="wrap bg"
    :style="theme"
  >
    <p-header title="联系我们" />
    <p-wrap
      :hasHeader="true"
      :hasFooter="true"
      style="position: relative"
    >
      <view class="intro">
        <xnw-item :info="intro" />
      </view>
      <!-- <view class="help">
        <view class="helpTitle">
          使用教程
        </view>
        <view class="item">
          <xnw-from :config="help" />
        </view>
      </view> -->
      <view class="appVersion">
        {{ appVersion }}
      </view>
    </p-wrap>
    <p-menu :defaultIndex="2" />
  </view>
</template>
<script>
export default {
  data () {
    return {
      intro: {
        title: '广州壹零健康科技有限公司',
        contents: [
          // { txt: '客服微信：example_id' },
          { txt: '客服热线：15302265955' },
          { txt: '服务时间：工作日 9:00 ~ 18:00' }
        ]
      },
      help: {
        data: [
          { title: '新手指引' },
          { title: '主机及配件介绍' },
          { title: '电池充电、更换电池' },
          { title: '如何使用电极片' }
        ]
      },
      appVersion: '',
      theme: `--contactBg: url(${this.globalData.config.contactBg});--theme-color:${this.globalData.config.theme} `
    }
  },
  async onLoad () {
    let { data } = await this.request(this.api.ECirculation.system.getSystemData)
    this.intro = {
      title: data.companyName,
      contents: [
        // { txt: '客服微信：example_id' },
        { txt: '客服热线：' + data.contactPhone },
        { txt: '服务时间：' + data.workingTime }
      ]
    }
    let { appVersion, deviceInfo } = this.globalData.headers
    this.appVersion = [appVersion, deviceInfo.version, deviceInfo.channelVar].join('-')
  },
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

  .intro {
    padding: 120rpx 20rpx 20rpx;
    /deep/ .itemBox {
      padding: 20rpx;
      box-sizing: border-box;
      border-radius: var(--border-radius);
      background: #fff;
      line-height: 2;
      .title {
        font-size: var(--font-h35);
        color: var(--theme-color);
      }
    }
  }
  .help {
    padding: 20rpx;
    .helpTitle {
      padding: 30rpx 0;
      font-size: var(--font-h3);
    }
    /deep/ .title {
      width: 10em;
    }
  }
  .appVersion {
    width: 100%;
    position: absolute;
    bottom: 0;
    line-height: 3;
    font-size: var(--font-h6);
    color: var(--color-disabled);
    text-align: center;
  }
}
</style>
