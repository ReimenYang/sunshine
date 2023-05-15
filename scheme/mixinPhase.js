export default {
  data () {
    return {
      settingPhase: { channelName: '', channelID: '', phase: '', data: [] },
      specialKey: ['pulseWidthB', 'frequencyB', 'pulseWidthC', 'frequencyC']
    }
  },
  methods: {
    phaseEdit (phase) {
      let { channelName, channelID, waveform, frequency, pulseWidth, frequencyB, pulseWidthB, frequencyC, pulseWidthC, rampUpTime, steadyTime, rampDownTime, restTime, relativePower } = phase
      let frequencyPlaceholder = this.waveform[waveform].frequency
      let pulseWidthPlaceholder = this.waveform[waveform].pulseWidth
      let radioGroup = Object.keys(this.waveform)
        .map(key => ({
          label: this.waveform[key].name,
          value: key,
          disabled: false,
          checked: (key - 0) === waveform,
          color: 'red',
          style: 'transform:scale(0.7)'
        }))
      this.settingPhase.channelName = channelName
      this.settingPhase.channelID = channelID
      this.settingPhase.phase = phase.phase
      let isMultiple = !!frequencyB
      let disabledStyle = isMultiple ? '' : 'opacity:.5'
      this.settingPhase.data = [{
        key: 'waveform', title: '波形类型',
        radio: {
          data: radioGroup,
          change: () => {
            let _waveform = radioGroup.find(item => item.checked).value
            this.settingPhase.data.forEach(item => {
              if (!item.key.startsWith('frequency') && !item.key.startsWith('pulseWidth')) return
              item.input.placeholder = this.waveform[_waveform][item.key.startsWith('frequency') ? 'frequency' : 'pulseWidth']
              item.input.value = ''
            })
          }
        }
      }, {
        key: 'frequency', title: '脉冲频率(单位:hz)',
        input: {
          value: frequency, placeholder: frequencyPlaceholder, type: 'number',
          input: this.inputOverflow
        }
      }, {
        key: 'pulseWidth', title: '脉冲宽度(单位:us)',
        input: {
          value: pulseWidth, placeholder: pulseWidthPlaceholder, type: 'number',
          input: this.inputOverflow
        }
      }, {
        key: 'isMultiple', title: '启用变频',
        switch: {
          checked: isMultiple, style: 'transform:scale(0.9)', change: val => {
            let _disabled = val
            this.settingPhase.data.forEach(item => {
              if (!this.specialKey.includes(item.key)) return
              item.style = _disabled ? '' : 'opacity:.5'
              if (!_disabled) {
                item.input.value = 0
                item.input.style = ''
              }
              item.input.disabled = !_disabled
            })
          }
        }
      }, {
        key: 'frequencyB', title: 'B点脉冲频率(单位:hz)', style: disabledStyle,
        input: {
          value: frequencyB, placeholder: frequencyPlaceholder, type: 'number',
          input: this.inputOverflow,
          disabled: !isMultiple
        }
      }, {
        key: 'pulseWidthB', title: 'B点脉冲宽度(单位:us)', style: disabledStyle,
        input: {
          value: pulseWidthB, placeholder: pulseWidthPlaceholder, type: 'number',
          input: this.inputOverflow,
          disabled: !isMultiple
        }
      }, {
        key: 'frequencyC', title: 'C点脉冲频率(单位:hz)', style: disabledStyle,
        input: {
          value: frequencyC, placeholder: frequencyPlaceholder, type: 'number',
          input: this.inputOverflow,
          disabled: !isMultiple
        }
      }, {
        key: 'pulseWidthC', title: 'C点脉冲宽度(单位:us)', style: disabledStyle,
        input: {
          value: pulseWidthC, placeholder: pulseWidthPlaceholder, type: 'number',
          input: this.inputOverflow,
          disabled: !isMultiple
        }
      }, {
        key: 'rampUpTime', title: '上升时间(单位:s)',
        number: { value: rampUpTime, min: 0, max: 10, disabled: false, typeDisabled: true }
      }, {
        key: 'steadyTime', title: '平台时间(单位:s)',
        number: { value: steadyTime, min: 0, max: 30, disabled: false, typeDisabled: true }
      }, {
        key: 'rampDownTime', title: '下降时间(单位:s)',
        number: { value: rampDownTime, min: 0, max: 10, disabled: false, typeDisabled: true }
      }, {
        key: 'restTime', title: '休息时间(单位:s)',
        number: { value: restTime, min: 0, max: 30, disabled: false, typeDisabled: true }
      }, {
        key: 'relativePower', title: '相对阶段1电量(单位:%)',
        number: { value: relativePower, min: 50, max: 200, step: 5, disabled: false, typeDisabled: true }
      }
      ]
      this.showSetp = ''
      this.globalData.wxPage.setting = this.settingPhase
    },
    phaseDel ({ channel, index }) {
      let phaseList = this.channelConfig.find(item => item.channelID === channel.channelID).phaseList
      phaseList.splice(index, 1)
      this.libs.global.ble.channelBuilder.phaseBuilder(phaseList)
      this.buildChannelConfig()
    },
    phaseConfirm (params) {
      let phaseList = this.channelConfig.find(item => item.channelID === params.channelID).phaseList
      let target = phaseList.find(item => item.phase === params.phase) || {}
      params = JSON.parse(JSON.stringify(params))
      // 更新阶段参数
      for (let key in params) target[key] = params[key]
      // 插入新阶段
      if (!target.phasecommand) phaseList.push(target)
      let _channel = this.workoutEdit.channelList.find(item => item.channel === target.channelID)
      _channel.phaseList = this.libs.global.ble.channelBuilder.phaseBuilder(phaseList)
      this.buildChannelConfig()
      this.phaseCancel()
    },
    phaseCancel () {
      this.showSetp = 'channel'
      this.settingPhase = { channelName: '', channelID: '', phase: '', data: [] }
    }
  }
}
