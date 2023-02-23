
import libs from '@/libs'
const channelBuilder = {
  getSum (keys, obj) {
    if (!obj) return keys.reduce((a, b) => Number(a) + Number(b))
    return keys.map(key => obj[key]).reduce((a, b) => Number(a) + Number(b))
  },
  commandBuilder (type, obj) {
    let headDATA = 'DATA:'
    let formula = {
      //         程序指令
      //         DATA:m,<channel>,<PhaseNumber>,<LoopNumber>,<Time>,<Sum>\r\n\0
      // 解析：
      // <channel>, 通道编号，1~4；
      // <PhaseNumber> 阶段数量，最小值1，最大值为8；
      // <LoopNumber> 循环数量，最小值0，最大值为8；
      // <Time>治疗时间，时间单位为秒，最少值为60(s)，最大值为10800(s), 即3小时；
      m: ['channel', 'phaseNumber', 'loopNumber', 'duration'],
      // 阶段指令
      // DATA:p,<channel>,<NumPhase>,<Waveform>,<Frequency>,<PulseWidth>,<RampUpTime>,<SteadyTime>,<RampDownTime>,<RestTime>,<Sum>\r\n\0
      // 解析：
      // <channel>, 通道编号，1~4；
      // <NumPhase> 第几阶段，最小值为1；
      // <Waveform> 波形类型，1为双相方波脉冲，2为指数波，待定;
      // <Frequency> 脉冲频率，1 ~ 400；
      // <PulseWidth> 脉冲宽度，1 ~ 500；
      // <RampUpTime> 上升时间，0 ~ 10，时间单位为秒；
      // <SteadyTime> 平台时间，0 ~ 30；
      // <RampDownTime> 下降时间，0 ~ 10；
      // <RestTime> 休息时间，0 ~ 30；
      p: ['channel', 'phase', 'waveform', 'frequency', 'pulseWidth', 'rampUpTime', 'steadyTime', 'rampDownTime', 'restTime'],
      // 循环指令
      //         DATA:l, <channel>,<NumLoop>,<LoopStartingPhase>,<LoopEndingPhase>,<LoopRepetition>,<Sum>\r\n\0
      // 解析：
      // <channel>, 通道编号，1~4；
      // <NumLoop> 第几序列，最小为1；
      // <LoopStartingPhase> 起始阶段，最小值为1；
      // <LoopEndingPhase> 结束阶段，最小值为1；
      // <LoopRepetition> 循环次数，最小值是2，最大值为255
      // 变频指令
      //   DATA:w, <channel>,<FreNumber>,<Sum>\r\n\0
      // 解析：
      // <channel>, 通道编号，1~4；
      // <FreNumber> 可变频率阶段数量，0~8
      w: ['channel', 'freNumber'],
      // 变频参数指令
      // DATA:f, <channel>, <Numfre >,<NumPhase>,<A_Frequency>,<A_PulseWidth>,<B_Frequency>,<B_PulseWidth>,<C_Frequency>,<C_PulseWidth>,<Sum>\r\n\0
      // 解析：
      // <channel>, 通道编号，1~4；
      // < Numfre > 第几频率参数设置序列，最小值为1；
      // <NumPhase> 第几阶段，最小值为1；
      // <A_Place> A点位置，0~100
      // <A_Frequency> A点频率
      // <A_PulseWidth> A点脉冲宽度
      // <B_Place> B点位置，0~100
      // <B_Frequency> B点频率
      // <B_PulseWidth> B点脉冲宽度
      // <C_Place> C点位置，0~100
      // <C_Frequency> C点频率
      // <C_PulseWidth> C点脉冲宽度
      // （目前现有方案ABC位置为平台0%，%50，%100位置， A<B<C）
      f: ['channel', 'numfre', 'phase', 'frequency', 'pulseWidth', 'frequencyB', 'pulseWidthC', 'frequencyC', 'pulseWidthC'],
      // 强度差指令
      //         DATA:b, <channel> ,<step_1> ,<step_2> ,<step_3> ,<step_4> ,<step_5> ,<step_6> ,<step_7> ,<step_8> <Sum>\r\n\0
      // 解析：
      // <channel>, 通道编号，1~4；
      // <step_1>，阶段1取基准值，默认为100
      // <step_2-8>，阶段2-8取相对于阶段1的基准值（以乘法计算）
      //   示例：step_1设置值为100，step_2设置值为140
      //   电流强度设置为8mA，那么阶段1的电流为8mA，阶段2的电流是8*140/100=11.2mA
      b: ['channel', 'step_1', 'step_2', 'step_3', 'step_4', 'step_5', 'step_6', 'step_7', 'step_8'],
      // 结束指令
      //         DATA:e, <channel>,<Sum>\r\n\0
      // 解析：
      // <channel>, 通道编号，1~4；
      e: ['channel']
    }[type]
    let options = formula.map(key => obj[key] || 0)
    let sum = channelBuilder.getSum([type.charCodeAt(), ...options])
    return [headDATA + type, ...options, sum].join()
  },
  phaseBuilder (phaseList) {
    let numfre = 1
    phaseList.sort((a, b) => a.phase - b.phase)
    return phaseList.map((_phase, i) => {
      _phase.phase = i + 1
      _phase.duration = channelBuilder.getSum(['rampUpTime', 'steadyTime', 'rampDownTime', 'restTime'], _phase)
      // 生成阶段指令
      _phase.phasecommand = channelBuilder.commandBuilder('p', _phase)

      // 生成变频指令
      delete _phase.phasefrequency
      if (_phase.frequencyB || _phase.frequencyC) {
        _phase.numfre = numfre
        numfre++
        _phase.phasefrequency = channelBuilder.commandBuilder('f', _phase)
      }
      return _phase
    })
  },
  channelBuilder (channelList) {
    return channelList.map(channel => {
      let { spliceList, labelName, phaseList, loopList } = channel
      // 更新贴片部位信息
      let _position = []
      let _imageIds = []
      let _imageUrl = []
      spliceList.forEach(_splice => {
        let { id, imageName, positionPlate, imageChannel, imageUrl } = _splice.postionDetail
        channel['position' + imageChannel] = _splice.checked ? id : ''
        if (!_splice.checked) return
        _position.push(imageName)
        let _spliceImg = libs.configProject.globalData.imageList.find(item => item.imageName === (labelName + imageChannel + '-' + positionPlate))
        _imageIds.push(_spliceImg.id, id)
        _imageUrl.push(_spliceImg.imageUrl, imageUrl)
      })
      channel.position = _position.join(' ')
      channel.imageIds = _imageIds.join(',')
      channel.imageUrl = _imageUrl.join(',')

      // 构建m指令
      channel.phaseNumber = phaseList.length
      channel.loopNumber = loopList.length
      channel.initcommand = channelBuilder.commandBuilder('m', channel)

      // 构建w指令
      channel.freNumber = phaseList.filter(_phase => _phase.phasefrequency).length
      if (channel.freNumber) channel.frequencycommand = channelBuilder.commandBuilder('w', channel)
      // 构建b指令
      Array.apply(null, { length: 8 }).forEach((n, i) => {
        channel['step_' + (i + 1)] = phaseList[i] ? phaseList[i].relativePower : 0
      })
      channel.powercommand = channelBuilder.commandBuilder('b', channel)
      // 构建e指令
      channel.finishcommand = channelBuilder.commandBuilder('e', channel)
      return channel
    })
  }
}

export default channelBuilder
