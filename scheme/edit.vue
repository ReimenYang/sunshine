<template>
  <view
    class="wrap"
    :style="theme"
  >
    <p-wrap>
      <base-info
        v-if="showSetp==='baseInfo'"
        @nextStep="baseInfoConfirm"
        ref="baseInfo"
        :baseInfo="baseInfo"
      />
      <channel
        v-show="showSetp==='channel'"
        @prevStep="stepTurning(-1)"
        @onConfirm="saveWorkout"
        @onEdit="phaseEdit"
        @onDel="phaseDel"
        ref="channel"
        :config="channelConfig.filter(item=>item.show)"
      />
      <postion-list
        :postionId="postionId"
        :splice="settingSplice"
        @onConfirm="postionConfirm"
        v-if="settingSplice"
      />
      <phase-setting
        :setting="settingPhase"
        @onCancel="phaseCancel"
        @onConfirm="phaseConfirm"
        v-if="settingPhase.phase"
      />
    </p-wrap>
  </view>
</template>
<script>
import mixinPhase from './mixinPhase.js'
import baseInfo from './_baseInfo'
import channel from './_channelConfig'
import postionList from './_postionList'
import phaseSetting from './_phaseSetting'
export default {
  mixins: [mixinPhase],
  components: { baseInfo, channel, postionList, phaseSetting },
  data () {
    return {
      stepList: ['baseInfo', 'channel'],
      showSetp: '',
      settingSplice: '',
      postionId: '',
      waveform: {
        1: { name: '双相方波脉冲', frequency: '范围1-450', pulseWidth: '范围20-1000' },
        2: { name: '指数波', frequency: '范围1-6', pulseWidth: '范围1500-3000' }
      },
      channelName: [0, 'A', 'B', 'C'],
      baseInfo: {
        data: []
      },
      workoutEdit: this.globalData.workoutEdit,
      spliceList: [],
      channelConfig: [{ splice: [], channelFrom: { data: [] }, phaseFrom: [] }],
      theme: `--theme-color:${this.globalData.config.theme} `
    }
  },
  async onLoad () {
    this.globalData.wxPage = { baseInfo: this.baseInfo }
    if (this.workoutEdit.id) await this.getSchemeDetail()
    await this.initData()
    await this.buildChannelConfig()
    // #ifdef MP-WEIXIN
    getApp().globalData.W = this
    // #endif
  },
  methods: {
    stepTurning (n = 0) {
      let i = this.stepList.findIndex(str => str === this.showSetp)
      this.showSetp = this.stepList[i + n]
    },
    async getSchemeDetail () {
      let schemeDetail = (
        await this.request(
          this.api.ECirculation.scheme.getSchemeDetail,
          { id: this.workoutEdit.id }
        )
      ).data

      this.workoutEdit.channelList.forEach(item => {
        let _detail = schemeDetail.channelList.find(object => object.channel === item.channel) || {}
        item.labelName = this.channelName[_detail.channel]
        item.position1 = _detail.position1
        item.position2 = _detail.position2
      })
    },
    initData () {
      // 生成插口名称
      let channelSettiing = this.workoutEdit.channelList.map(({ channel, splices }) => [this.channelName[channel], splices]).flat()
      // 生成插口属性及列表
      this.spliceList = this.channelName
        .reduce((a, b) => b ? [...a, b + 1, b + 2] : a, [])
        .map(label => {
          let _index = channelSettiing.findIndex(str => str === label[0])
          let _used = _index > -1

          // 没有开启通道，接口2不能设置
          // let disabled = !_used && (label[1] !== '1')
          // 接口二状态与接口一同步，不能单独设置
          let disabled = label[1] !== '1'

          // 是否已选
          // let checked = _used && (label[1] <= channelSettiing[_index + 1])
          // 接口二状态与接口一同步，不能单独设置
          let checked = _used

          return { label, value: label, disabled, checked, color: 'red', style: 'transform:scale(0.7)' }
        })
      // 生成通道属性及列表
      this.channelConfig = []
      this.spliceList.forEach((_settiing, i) => {
        let _splice = i % 2
        // 插口1要插入新对象
        if (!_splice) this.channelConfig.push({ splice: [], channelFrom: { data: [] }, phaseFrom: [] })
        // 处理插口的部位数据
        let _config = this.channelConfig.slice(-1)[0]

        _config.channelName = _settiing.label[0]
        _config.channelID = this.channelName.findIndex(name => name === _config.channelName)
        _config.name = _config.channelName + '通道程序设置'
        let channelDetail = this.workoutEdit.channelList.find(item => item.channel === _config.channelID) || {}

        _config.phaseList = channelDetail.phaseList || []

        let postionId = channelDetail['position' + (_splice + 1)]
        _settiing.postionDetail = this.globalData.imageList.find(item => item.id === postionId) || {}
        _config.splice.push(_settiing)

        if (channelDetail.phaseList) channelDetail.phaseList.forEach(item => item.channelID = _config.channelID)
      })
      // 生成方案基本信息
      this.baseInfo.data = [{
        key: 'name', title: '方案名称',
        input: {
          value: this.workoutEdit.name, placeholder: '必填', input: (val, item) => {
            item.input.style = item.input.value ? '' : 'border:1px solid red;'
            if (!item.input.value) this.toast(item.title + '不能为空')
            return !!item.input.value
          }
        }
      }, {
        key: 'duration', title: '默认治疗时长(分钟)',
        input: { value: this.workoutEdit.duration / 60, placeholder: '范围1-180', type: 'number', input: this.inputOverflow }
      }, {
        key: 'description', title: '方案描述',
        textarea: { value: this.workoutEdit.description, placeholder: '请输入', }
      }, {
        key: 'channel', title: '使用通道',
        checkbox: {
          data: this.spliceList,
          change: (val, item, e) => {
            if (!item.checkbox.data.filter(item => item.checked).length) {
              this.toast('至少使用一个通道')
              return false
            }
            if (e) {
              let _group = e.detail.value.filter(str => str[1] === '1').map(str => str[0])
              this.spliceList.forEach(obj => {
                // 该组接口1已打开
                let baseSpliceOpened = _group.includes(obj.label[0])
                // obj.disabled = !baseSpliceOpened && (obj.label[1] !== '1')
                // obj.checked = baseSpliceOpened && obj.checked
                // 接口二状态与接口一同步，不能单独设置
                obj.checked = baseSpliceOpened
              })
            }
            this.buildChannelConfig()
            return true
          }
        }
      }]
      this.showSetp = this.stepList[0]
    },
    // 生成/更新通道属性及列表
    buildChannelConfig () {
      this.channelConfig.forEach(_config => {
        // 至少一项勾选就显示
        _config.show = _config.splice.map(item => item.checked).includes(true)
        // 构建插口显示格式
        _config.channelFrom.data = []
        _config.splice.forEach(_settiing => {
          if (!_settiing.checked) return

          _config.channelFrom.data.push({
            key: _settiing.label, title: _settiing.label + '插口-电刺激部位', setClass: '',
            link: {
              label: _settiing.postionDetail.imageName, value: _settiing.label, style: 'height:1em;', onclick: val => {
                this.settingSplice = val.value
                this.postionId = String(this.spliceList.find(item => item.label === this.settingSplice).postionDetail.id)
                this.showSetp = ''
              }
            }
          })
        })
        // 构建阶段显示格式
        _config.phaseFrom = []
        if (_config.phaseList.length) {
          _config.phaseFrom = _config.phaseList.map(item => ({
            ...item,
            title: '阶段' + item.phase,
            contents: [
              ...[
                item.frequency && { txt: `${item.frequency}hz ${item.pulseWidth}us` },
                item.frequencyB && { txt: `${item.frequencyB}hz ${item.pulseWidthB}us` },
                item.frequencyC && { txt: `${item.frequencyC}hz ${item.pulseWidthC}us` }
              ].filter(obj => obj),
              {
                txt: `${this.waveform[item.waveform].name} 相对电量 ${item.relativePower} %`, style: 'color:#999'
              },
              {
                txt: `上升${item.rampUpTime}s 平台${item.steadyTime}s 下降${item.rampDownTime}s 休息${item.restTime}s`
              }
            ]
          }))
        }
      })
      // #ifdef MP-WEIXIN
      this.channelConfig.forEach(item => this.globalData.wxPage['signChannelConfig' + item.name[0]] = item.channelFrom)
      // #endif
    },
    baseInfoConfirm (baseInfo) {
      this.workoutEdit.name = baseInfo.name
      this.workoutEdit.duration = baseInfo.duration * 60
      this.workoutEdit.description = baseInfo.description
      this.channelConfig.forEach(item => {
        if (!item.show) return
        let _obj = this.workoutEdit.channelList.find(obj => obj.channel === item.channelID)
        if (_obj) return
        let newChannel = {
          phaseList: [],
          spliceList: [],
          loopList: [],
          // imageUrl: "https://sapi.xinuowang.com:9000/product-public/consume/长方形_B1.png,https://sapi.xinuowang.com:9000/product-public/consume/横骨.png,https://sapi.xinuowang.com:9000/product-public/consume/长方形_B2.png,https://sapi.xinuowang.com:9000/product-public/consume/S2-S4-2.png",
          // initcommand: "DATA:m,2,4,0,<time>,<sum>\\r\\n\\0",
          // frequencycommand: "DATA:w,2,2,123\\r\\n\\0",
          // finishcommand: "DATA:e,2,103\\r\\n\\0",
          // powercommand: "DATA:b,2,100,170,140,80,0,0,0,0,590\\r\\n\\0",
          // id: 286,
          appId: this.workoutEdit.appId,
          workoutId: this.workoutEdit.id,
          name: '通道' + item.channelID,
          channel: item.channelID,
          splices: item.channelFrom.data.length,
          // position: "横骨 S2-S4",
          // imageIds: "35,58,38,50",
          labelName: item.channelName,
          // position1: 58,
          // position2: 15,
        }
        this.workoutEdit.channelList.push(newChannel)
      })
      this.workoutEdit.channelList.sort((a, b) => a.channel - b.channel)
      this.stepTurning(1)
    },
    postionConfirm (postionId) {
      if (postionId !== this.postionId) {
        this.spliceList.find(item => item.label === this.settingSplice).postionDetail = this.globalData.imageList.find(item => item.id === postionId)
      }
      this.buildChannelConfig()
      this.showSetp = 'channel'
      this.settingSplice = this.postionId = ''
    },
    inputOverflow (val, item, apply = []) {
      if (item.disabled) return true
      // 特殊频宽和频率允许值处理逻辑
      if (this.specialKey.includes(item.key)
        &&
        !this.settingPhase.data.find(obj => obj.key === 'isMultiple').switch.checked
      ) apply = ['', 0, '0']
      let _value = item.input.value
      let [min, max] = item.input.placeholder.slice(2).split('-')

      let _error = _value ? '' : (item.title + '不能为空')
      if (_value && ((_value - min) < 0 || (max - _value) < 0)) _error = item.title + '超出' + item.input.placeholder
      try {
        if (apply.length && apply.includes(_value)) _error = ''
      } catch (e) {
        // TODO handle the exception
      }

      item.input.style = _error ? 'border:1px solid red;' : ''
      if (_error) this.toast(_error)
      return !_error
    },
    async saveWorkout () {
      let { id, name, duration, description, channelList } = this.workoutEdit
      // 整理通道数据
      let validChannel = this.channelConfig.reduce((a, b) => b.show ? [...a, b.channelID] : a, [])
      let _channelList = channelList.filter(item => validChannel.includes(item.channel))

      _channelList.forEach(channel => channel.spliceList = this.channelConfig.find(item => channel.channel === item.channelID).splice)
      this.workoutEdit.channelList = this.libs.global.ble.channelBuilder.channelBuilder(_channelList)
      let params = { id, name, duration: duration / 60, description, channelList: _channelList.map(({ channel, position1, position2, phaseList }) => ({ channel, position1, position2, phaseList })) }
      let { code, errorMessage } = await this.request(this.api.ECirculation.scheme.updateScheme, params)
      if (code, errorMessage) return this.toast(errorMessage)
      uni.navigateBack()
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  height: 100vh;
  padding-bottom: 100rpx;
  box-sizing: border-box;
  /deep/ {
    .itemBox {
      position: relative;
    }
    .form {
      margin: 30rpx 0;
      .title,
      .txt {
        padding-right: 30rpx;
      }
      // #ifdef MP-WEIXIN
      .checkbox .label {
        width: 50%;
        display: inline-block;
        line-height: 3;
        text-align: center;
      }
      // #endif
    }
    .fix {
      width: 100vw;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 2;
      .btn {
        line-height: 100rpx;
        border: none;
        border-top: var(--border-normal);
        border-radius: 0;
      }
    }
  }

  .emptyNotice {
    padding: 60rpx 0;
    text-align: center;
    line-height: 2;
    color: var(--color-light);
  }
}
</style>
