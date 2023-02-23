<script>
import libs from '@/libs'
let globalData = libs.configProject.globalData
export default {
  onLaunch: async function () {
    // app颜色，图片配置
    let config = {
      periodPain: { // 痛经
        appName: '经期健康管理',
        theme: '#7A56EC'
      },
      PE: { // 早泄
        appName: '易循环', //
        theme: '#127087'
      },
      sunshine: { // 晨硕治疗仪
        appName: '晨硕治疗仪',
        theme: '#127087'
      }
    }
    let subName = libs.configProject.subName
    // let urlImg = libs.configProject.urlImg + 'consume/' + subName
    let urlImg = '/static/' + subName
    globalData.config = {
      ...config[subName],
      logo: urlImg + '/logo.png',
      indexBg: urlImg + '/index_bg.png',
      contactBg: urlImg + '/contact_bg.png',
      contactQrCode: urlImg + '/logo.png',
      questionnairesBanner: urlImg + '/questionnaires_banner.png',
      guideConnect: urlImg + '/guide_connect.png',
      guideMaterial2: urlImg + '/guide_material2.png',
      guideMaterial3: urlImg + '/guide_material3.png',
    }
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
  globalData: {
    X: { ...libs, globalData }
  }
}
</script>

<style lang="scss">
@import "./assets/css/reset.scss";
@import "./assets/fonts/iconfont.css";
@import "./assets/fonts/consume.css";
page {
  background: var(--color-background);
}
.themeBg {
  background: url("/static/index_bg.png") no-repeat top center/100%;
}
.itemBoxTitle {
  padding: 40rpx 0 20rpx;
  font-size: var(--font-h3);
  color: var(--color-light);
}
.itemBox {
  margin-top: 20rpx;
  padding: 20rpx;
  border-radius: var(--border-radius);
  background: #fff;
}
.itemTitle {
  padding: 20rpx 0 10rpx;
}
/* cover 抹平平台差异 */
.dialogBody .uni-grid-wrap {
  width: 100vw !important;
}
/*每个页面公共css */
</style>
