export default {
  data () {
    // let {
    //   bleReady, // 蓝牙api是否完成初始化
    //   bleOnline, // 手机蓝牙是否处于可连接状态
    //   searching, // 是否在搜索蓝牙设备
    //   connected, // 手机是否与设备对接上,可以发指令
    //   paired, // 手机是否与设备配对上，已经发送c指令，处于pbt状态
    //   devicesReady // 初始化指令是否发送成功，设备处于可开始状态
    // } = this.globalData
    return {
      BioStimBleModule: this.libs.global.ble.BioStimBleModule,
      EventBus: this.libs.global.ble.EventBus,
      device: this.libs.data.getStorage('device'),
      workTime: 60, // 单位：秒
      // bleReady, // 蓝牙api是否完成初始化，对应openBluetoothAdapter
      // bleOnline, // 手机蓝牙是否处于可连接状态,对应getBLEConnectStatus
      // searching, // 是否在搜索蓝牙设备，对应startBluetoothDevicesDiscovery
      // connected, // 手机是否与设备对接上，并成功开启了数据交互监听,可以发指令，对应createBLEConnection
      // paired, // 手机是否与设备配对上，执行完获取设备信息指令，并按一定的业务规则进行判断，符合联机条件，处于pbt状态
      // devicesReady, // 初始化指令是否发送成功，设备处于可开始状态
      fallTime: 0, // 最近跌落提示时间
      fallTimeInterval: 5 * 1000, // 跌落判断间隔
      showFall: false, // 跌落提示框
      setCurrentTimeInterval: 2 * 1000, // 调电判断间隔
      bleState: {}
    }
  },
  created () { this.bleState = this.BioStimBleModule.bleState },
  async onShow () {
    // this.paired = this.bleState.paired
    this.device = this.globalData.device = this.libs.data.getStorage('device')
    console.log('this.BioStimBleModule.bleState', this.BioStimBleModule.bleState)
    let { eventBusReady, bleOnline, bleReady } = this.bleState = this.BioStimBleModule.bleState
    // 注册蓝牙改变全局监听事件,全局基础服务，千万不能重复注册
    if (!eventBusReady) {
      this.EventBus.register(this.eventBusCallBack)
      this.bleStateChangeRegister(this)
      this.bleState.eventBusReady = true
    }
    console.log(eventBusReady, this.bleState.eventBusReady, this.BioStimBleModule.bleState.eventBusReady)

    if (!bleOnline) {
      return uni.showModal({
        content: '客户端蓝牙未打开',
        showCancel: true,
        cancelText: '退出',
        success: res => {
          if (res.confirm) {
            this.BioStimBleModule.bluetoothOn()
          } else if (res.cancel) {
            this.libs.data.exit()
          }
        }
      })
    }

    // 避免重复激活服务
    if (!bleReady) await this.bleInit()

    if (this.globalData.workout) this.workTime = this.globalData.workout.duration
    this.pageInit()
  },
  methods: {
    // 注册蓝牙改变全局监听事件
    async bleStateChangeRegister (_this) {
      console.log('注册蓝牙改变全局监听事件')
      // let _this = this
      this.globalData.bleStateChange = {
        discoveringFalse: { console () { console.log('关闭发现') } },
        discoveringTrue: { console () { console.log('开启发现') } },
        availableFalse: {
          console () {
            console.log('关闭蓝牙')
            // this.libs.data.exit('蓝牙已关闭，请开启后重新打开app')
          },
          closeBluetoothAdapter () {
            console.log('蓝牙不可连接')
            _this.reLaunchIndex()
            // 蓝牙已经关闭，次数执行closeBluetoothAdapter一定报错(10001)
            // this.BioStimBleModule.closeBluetoothAdapter()
          }
        },
        availableTrue: {
          console () {
            console.log('开启蓝牙')
          },
          async openBluetoothAdapter (res) {
            console.log('蓝牙空闲，可连接', res)
            // if (_this.globalData.bleReady) await _this.BioStimBleModule.closeBluetoothAdapter()
            if (!this.BioStimBleModule.bleState) await _this.bleInit()
          }
        }
      }
      // this.BioStimBleModule.onBluetoothAdapterStateChange(true)
    },
    // 执行蓝牙改变事件
    async bleStateChangeAction (res) {
      if (!Object.keys(res).includes('available')) return
      // let discoverEven = this.globalData.bleStateChange[res.discovering ? 'discoveringTrue' : 'discoveringFalse']
      // if (discoverEven) Object.keys(discoverEven).forEach(key => discoverEven[key](res))

      let availableEven = this.globalData.bleStateChange[res.available ? 'availableTrue' : 'availableFalse']
      if (availableEven) Object.keys(availableEven).forEach(key => availableEven[key](res))
    },
    async stateManage (target, msgCode) {
      let { log, toast, stateName, time = 2000, icon = 'none' } = target
      if (typeof state !== 'boolean') return
      // 操作当前状态
      // this.$set(this, stateName, state)
      // this.globalData[stateName] = state
      // this.paired = this.globalData.paired

      // if (stateName !== 'searching' && !state) {
      //   // 状态顺序，搜索状态与其他状态的关系需要注意
      //   let stateList = ['bleReady', 'bleOnline',
      //     // 'searching',
      //     'connected', 'paired', 'devicesReady']
      //   // 操作后续状态
      //   stateList.slice(stateList.indexOf(stateName) + 1).forEach(_state => {
      //     this.$set(this, _state, false)
      //     this.globalData[_state] = false
      //     // if (_state === 'paired') this.handlePair(this.bleState.paired)
      //   })
      // }
      // if (stateName === 'paired') this.handlePair(this.bleState.paired)
      if (toast) this.toast(toast, time, icon)
      let { bleReady, bleOnline, searching, connected, paired } = this.BioStimBleModule.bleState// this.globalData
      console.log(
        '触发来源', msgCode,
        '操作状态', log, stateName,
        'bleReady', bleReady,
        'bleOnline', bleOnline,
        'searching', searching,
        'connected', connected,
        'paired', paired,
        // 'devicesReady', devicesReady
      )
    },
    async bleInit () {
      /**
   * 初始化蓝牙模块
   * 其他蓝牙相关 API 必须在 uni.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。
   * 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 uni.openBluetoothAdapter 会返回错误（errCode=10001），表示手机蓝牙功能不可用。
   * 此时APP蓝牙模块已经初始化完成，可通过 uni.onBluetoothAdapterStateChange 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。
   * 工作顺序：
   * 参数设置——打开蓝牙模块——检查手机蓝牙开关状态——搜索设备——连接设备——配对设备——给设备发送工作指令
   * 连接设备：指执行了createBLEConnection，并成功开启了数据交互监听
   * 配对设备：执行完获取设备信息指令，并按一定的业务规则进行判断，符合联机条件
   */
      await this.BioStimBleModule.openBluetoothAdapter()

      // 检查蓝牙是否可连接
      // if (this.globalData.bleReady) await this.BioStimBleModule.getBLEConnectStatus()
    },
    async pageInit () {
      if (this.globalData.pageInit) return this.globalData.pageInit()
    },
    getPageUrl () {
      return getCurrentPages()[getCurrentPages().length - 1].route
    },
    reLaunchIndex (from) {
      // let noAction = ['pages/index/contact', 'pages/scheme/record', 'pages/scheme/index', 'pages/bluetooth/connect', 'pages/bluetooth/running'].includes(this.getPageUrl())
      // 22020928 需求from罗 运行过程中手动 关闭蓝牙，返回首页
      let noAction = ['pages/index/contact', 'pages/scheme/record', 'pages/scheme/index', 'pages/bluetooth/connect'].includes(this.getPageUrl())
      if (noAction) return
      let back = ['pages/index/contact', 'pages/scheme/index'].includes(this.getPageUrl())
      if (back) return uni.navigateBack()
      if (this.getPageUrl() !== 'pages/scheme/index') uni.reLaunch({ url: '/pages/scheme/index?from=' + from })
    },
    // 设置回调事件
    async eventBusCallBack (res) {
      let { msgCode, data = {} } = res
      let logMsg = this.EventBus.logMsg[msgCode]
      let toast = logMsg.toast
      // 1.将本次事件处理完成
      switch (msgCode) {
        case this.EventBus.BLE_UNREADY: // 框架未完成初始化
          if (data.statusCode === 500 && data.err.errCode === 10001) {
            toast += ',请检查手机蓝牙是否打开'
            toast += data.err.errCode
          }
          break
        case this.EventBus.CONNECT_FAIL: // 设备连接失败
        case this.EventBus.CONNECT_BREAK: // 被动断开连接
        case this.EventBus.PAIR_FAIL: // 设备配对失败
        case this.EventBus.PAIR_BREAK: // 设备配对断开
          if (data.statusCode === 501) {
            if (data.err.errCode === 10012 || data.err.errCode === 10013) toast += ',请检查设备是否开机'
            toast += data.err.errCode
          }
          break
        case this.EventBus.GET_SERIALNO: // 设备序列号数据，蓝牙连接成功后只回调一次
          this.globalData.deviceInfo = data
          // console.log('设备序列号数据，蓝牙连接成功后只回调一次', this.globalData.deviceInfo)
          break
        case this.EventBus.GET_RECORD: // 获取训练记录
          this.globalData.record = data
          break
        case this.EventBus.COMMAND_FAIL: // 指令发送失败
          this.toast(data)
          break
      }
      // 2.处理状态
      await this.stateManage({ ...logMsg, toast }, msgCode, data)
      // 3.执行后续相关动作
      switch (msgCode) {
        case this.EventBus.BLE_ONLINE: // 手机蓝牙已打开
          await this.bleStateChangeAction(data)
          break
        case this.EventBus.BLE_OFFLINE: // 手机蓝牙未打开
          this.BioStimBleModule.bluetoothOn()// 这个调用可能需要优化
          await this.bleStateChangeAction(data)
          break
        case this.EventBus.BLE_UNREADY: // 框架未完成初始化
          // this.libs.data.exit('框架未完成初始化')
          // this.bleInit()
          break
        case this.EventBus.CONNECT_FAIL: // 设备连接失败
        case this.EventBus.CONNECT_BREAK: // 被动断开连接
        case this.EventBus.PAIR_FAIL: // 设备配对失败
        case this.EventBus.PAIR_BREAK: // 设备配对断开
          clearInterval(this.globalData.loopRecord)// 避免r指令堆积
          if (data.statusCode === 504) {
            toast += ',启用订阅失败,请退出并在5秒后重启APP'
            toast += data.err.errCode
            this.libs.data.exit(toast)
            return
          }
          // if (logMsg.stateName === 'paired') await this.closeBLEConnection()
          this.reLaunchIndex('connect_close', data)
          break
        case this.EventBus.GET_SERIALNO: // 设备序列号数据，蓝牙连接成功后只回调一次
          // case this.EventBus.CONNECTED: // 连接成功
          // 使用GET_SERIALNO的逻辑会更严谨，但由于有时候收不到反馈，只能用CONNECTED代替
          console.log('设备序列号数据，蓝牙连接成功后只回调一次', data, this.globalData.isNewDevice)
          this.globalData.headers.deviceInfo = data
          if (this.globalData.isNewDevice === 'N') await this.createPaired()
          // 如果是优E康，检查训练记录
          if (this.globalData.isNewDevice === 'Y') await this.getRecord()
          break
        case this.EventBus.PAIRED: // 设备配对成功
          this.handlePair(data)
          break
        case this.EventBus.GET_RECORD: // 获取训练记录
          console.log('显示获取训练记录', this.bleState.paired, data, this.getPageUrl())
          // 如果未配对，启动配对
          if (!this.bleState.paired) await this.createPaired()
          await this.handleRecord(data)
          break
        case this.EventBus.LONG_RECIVED: // 长连接心跳包
          // console.log('长连接心跳包', msgCode, data, this.handleLongRecived)
          await this.handleLongRecived(data)
          break
      }
    },
    handlePair (boolean) {
      console.log('设备配对结果', boolean, this.globalData.handlePair)
      let _page = this.getPageUrl()
      switch (_page) {
        case 'pages/bluetooth/connect':
        case 'pages/scheme/index':
          this.globalData.handlePair(boolean)
          break
      }
    },
    async handleRecord (data) {
      let _page = this.getPageUrl()
      let { recordId, totalTime, time, isStop } = data
      console.log('获取r指令', data, _page, recordId, totalTime, time, isStop)
      clearInterval(this.globalData.loopRecord)
      if (!recordId) return// 设备没有记录

      let _record = (await this.libs.request(this.libs.api.ECirculation.treatment.getRecordByRecordId, { recordId, deviceName: this.globalData.device.name })).data
      console.log('训练记录', 'workoutRecord' + recordId, _record)
      if (!_record) return// app没有记录
      _record.isStop = isStop
      _record.duration = totalTime
      _record.time = time
      _record.deviceName = this.device.name
      let workout = this.globalData.workoutList.find(item => item.workoutId === _record.workoutId)
      let { workoutId, workoutName, workoutDescription, portNum = 2, initCommand = '0,0,0' } = workout
      let [, , phaseNumber] = initCommand.split(',')
      _record.workout = workout
      _record.workoutName = workoutName
      _record.portNum = portNum
      _record.workoutId = workoutId
      _record.workoutDescription = workoutDescription
      _record.phaseNumber = phaseNumber
      this.globalData.workoutRecord = _record
      // 未结束
      if (isStop === '0') {
        if (!this.globalData.workout) {
          // let _workout = this.workoutList.find(item => item.workoutId === this.globalData.workoutRecord.workoutId)
          // if (!_workout) return this.toast('找不到记录对应的训练方案')
          this.globalData.workout = _record.workout
        }

        // this.globalData.workout.duration = totalTime || this.workTime
        // this.globalData.workout.time = time || 0
        console.log('训练方案', this.globalData.workout)

        switch (_page) {
          case 'pages/bluetooth/running':
            if (this.globalData.handleRecord) await this.globalData.handleRecord(data)
            break
          default:
            uni.reLaunch({ url: '/pages/bluetooth/running' })
        }
        return
      }

      // 已结束
      // if (isStop === '1') {
      // 这个地方有歧义，未结束的会显示设置的训练时长，已结束的会显示实际训练时长
      _record.duration = _record.specificDuration = time
      // _record.recordId = _record.id
      _record.endDateTime = this.libs.data.dateNow(_record.startTime + parseFloat(time) * 1000)
      console.log('已结束', isStop, !isStop, '结束时间：', _record.endDateTime, '训练时长：', time)
      console.log('训练结束，更新训练记录', _record)

      // 前端处理今日已训练的数据，减少后台请求
      // _record.workout.todayState = 'Y'
      // _finishObj.title = _finishObj.workoutName + '（今天已训练）'

      let _res = await this.libs.request(this.libs.api.ECirculation.treatment.endTreatment, _record)
      if (_res) this.clearRecord()
      // this.libs.data.removeStorage(recordId)
      delete this.globalData.workoutRecord
      // let whithPage = ['pages/scheme/index', 'pages/bluetooth/setCurrent']
      // let whithPage = ['pages/scheme/index']
      // if (!whithPage.includes(_page)) uni.reLaunch({ url: '/pages/scheme/index?from=' + _page.split('/').slice(-1).join() })
      // return
      // }
    },
    async handleLongRecived (data) {
      let deviceState = this.globalData.deviceState
      if (!deviceState) this.globalData.deviceState = deviceState = {}
      let { channel } = data
      data.settingCHL = data.settingCHL / 10
      data.settingCHR = data.settingCHR / 10
      // 提示跌落
      let isFall = await this.isFall(data)
      let { settingCHL, settingCHR } = data
      deviceState[channel] = { ...data, isFall, settingCHL, settingCHR }

      // let { count, channel, numPhase, intensityCHL, intensityCHR, bat, stateRunning, statePhase, remainingTime, wavepercent, settingCHL, settingCHR, stateCHL, stateCHR, sum } = data
      // console.log(
      //   '通道', channel,
      //   '当前阶段', numPhase,
      //   '当前左强度', intensityCHL ,
      //   '当前右强度', intensityCHR ,
      //   '运行状态', { '0': '设置', '1': '运行', '2': '暂停', '3': '停止', '4': '锁定' }[stateRunning],
      //   '阶段状态', { '1': '上升', '2': '平台', '3': '下降', '4': '休息', '5': '调整刺激强度', '6': '输出开路', '7': '训练完成' }[statePhase],
      //   '阶段左强度', settingCHL ,
      //   '阶段右强度', settingCHR ,
      //   '左贴片', { '1': '训练中', '2': '脱落' }[stateCHL],
      //   '右贴片', { '1': '训练中', '2': '脱落' }[stateCHR],
      //   '跌落判断', isFall,
      //   this.getPageUrl()
      // )
      // switch (this.getPageUrl()) {
      //   case 'pages/bluetooth/running':
      //   case 'pages/bluetooth/setCurrent':
      // if (data.stateRunning==='3'||data.stateRunning==='4'){
      // 		this.endTreatment()
      // 		this.reLaunchIndex()
      // }
      if (this.globalData.handleLongRecived) await this.globalData.handleLongRecived(data)
      //     break
      // }
    },
    async isFall (data) {
      let { channel, statePhase, stateCHL, stateCHR } = data
      // stateRunning 运行状态，可以是: 0 设置 ，1 运行，2 暂停，3 停止，4 锁定
      // 停止倒计时：设置，暂停，停止
      // 不可调电：暂停，停止，锁定
      // 判断跌落：设置，运行
      // 判断输出开路
      if (statePhase !== '6') return ''
      // 提醒间隔判断
      let timestamp = new Date().valueOf()
      if (timestamp - this.fallTime < this.fallTimeInterval) return ''
      let fallState = []
      if (stateCHL === '2') fallState.push('settingCHL')
      if (stateCHR === '2') fallState.push('settingCHR')
      let postion = this.globalData.workout.channelList
        .map(item => item.spliceList)
        .flat()
        .filter(item => item.channel === Number(channel) && fallState.includes(item.side))
        .map(item => item.postion)
        .join()

      console.log('判断跌落', postion)
      // console.log(data)
      // console.log(stateCHL === '2', settingCHL !== '0', stateCHL === '2' && settingCHL !== '0')
      // console.log(stateCHR === '2', settingCHR !== '0', stateCHR === '2' && settingCHR !== '0')
      // console.log(left, right, fallState, this.showFall, !fallState, !fallState || this.showFall)
      // 判断提示框显示和真假脱落 强度10以下未必真实
      if (!postion || this.showFall) return postion

      this.showFall = true
      uni.showModal({
        content: postion + '电极片从人体中脱落，训练暂停。请粘贴到正确的部位后，点击开始按钮继续训练。',
        showCancel: false,
        success: res => this.showFall = !res.confirm
      })
      this.fallTime = timestamp
      return postion
    },
    // 搜索设备
    async bleSearch () {
      if (this.bleState.bleReady && !this.bleState.searching) return this.BioStimBleModule.startBluetoothDevicesDiscovery()
    },
    // 停止搜索
    stopSearch () {
      return this.BioStimBleModule.stopBluetoothDevicesDiscovery()
    },
    // 选择设备
    selectDevice (item) {
      if (item.isCheck) return
      // 这里必须用$set
      this.BioStimBleModule.deviceList.forEach(obj => { this.$set(obj, 'isCheck', obj.deviceId === item.deviceId) })
      // 保存设备信息，方便其他地方调用
      item.mode = item.name.split(' ')[0]
      this.globalData.device = this.device = item
      console.log('选择设备', this.globalData.device)
      this.libs.data.setStorage('device', this.globalData.device)
    },
    // 连接设备
    async connectDevice () {
      // 检查初始化状态，可能会与监听事件产生时机问题
      // 未初始化，注册打开后自动执行的事件
      await this.BioStimBleModule.getServiceReady()
      // if (!(await this.BioStimBleModule.getServiceReady('boolean'))) {
      //   this.globalData.bleStateChange.availableTrue.connectDevice = this.connectDevice
      //   this.toast('请检查手机蓝牙是否打开')
      //   return
      // }
      uni.showLoading({
        title: '设备连接中...',
        mask: true
      })
      // if (this.globalData.bleStateChange.availableTrue.connectDevice) delete this.globalData.bleStateChange.availableTrue.connectDevice

      console.log('连接设备', this.globalData.device)
      let _connected = await this.BioStimBleModule.createBLEConnection(this.globalData.device.uuid)
      uni.hideLoading()

      if (_connected.statusCode !== 200) return this.toast('连接失败')
      // 执行配对
      return _connected
    },
    // 尝试配对
    createPaired () {
      console.log('尝试配对')
      return this.BioStimBleModule.createPaired(this.pairedRule)
    },
    // 配对规则
    async pairedRule () {
      return true
      // if (!this.globalData.deviceInfo) return
      // console.log('配对设备', this.globalData.deviceInfo, this.globalData.record)
      // // 旧设备
      // if (this.globalData.deviceInfo.version === '0') return true
      // let { recordId, isStop } = this.globalData.record
      // // 没有记录
      // if (!recordId || isStop === '1') return true
      // let workoutRecord = (await this.libs.request(this.libs.api.wyjkDevice.consumerElectronics.getUserTreatmentHistory, { userTreatmentHistoryId: recordId })).data
      // // 判断是否当前用户
      // console.log(workoutRecord, this.globalData.userInfo.id)
      // return workoutRecord.userId === this.globalData.userInfo.id
    },
    // 设置时长
    setWorkTime (time) {
      this.workTime = time * 60
    },
    // 发送初始命令
    async sendInitCmd () {
      let channelList = this.globalData.workout.channelList
      channelList.sort((a, b) => a.channel - b.channel)

      for (let i = 0; i < channelList.length; i++) {
        let options = channelList[i]
        // let phaseList = this.globalData.workout.workoutphaselist || this.globalData.workout.phaseList || this.globalData.workout.workoutPhaseList[0]
        // let options = { ...this.globalData.workout, ...phaseList }
        let MCommand = options.initCommand = options.initcommand || options.initCommand
        let PCommand = options.phaseList = options.workoutphaselist || options.phaseList || options.workoutPhaseList
        if (!MCommand || !PCommand) return this.toast('程序初始化指令错误！')
        // 检查频率与脉宽是否正常
        let _boolean = PCommand.map(item => {
          item.phaseCommand = item.phasecommand || item.phaseCommand
          item.phaseFrequency = item.phasefrequency || item.phaseFrequency
          return item.phaseCommand.split(',')
        })
          .reduce((a, [, , , Frequency, PulseWidth]) => [...a, Frequency, PulseWidth], [])
          .map(n => n < 1)
          .includes(true)
        if (_boolean) return this.toast('频率或脉宽错误！')
        options.frequencyCommand = options.frequencyCommand || options.frequencycommand
        options.bchannelCmd = options.bchannelCmd || options.powercommand
        options.loopCommand = []
        if (options.loopList) options.loopCommand = options.loopList.map(item => item.command)
        else {
          for (let i = 1; i < 10; i++) { // 发送loopcommand1-loopcommand9字段的指令
            let command = options['loopcommand' + i] || options['loopCommand' + i]
            options.loopCommand.push(command)
          }
        }
        console.log('发送初始命令', options, this.workTime)
        await this.BioStimBleModule.sendInitCmd(options, this.workTime)
      }
    },
    // 设置强度
    setCurrent (name, channel, value) {
      if (!this.globalData.setCurrentTimeStamp) this.globalData.setCurrentTimeStamp = {}
      this.globalData.setCurrentTimeStamp[channel] = new Date().valueOf()
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule[name](channel, value)
    },
    // 左减电
    async leftMinus (channel) {
      return this.setCurrent('leftMinus', channel)
    },
    // 左加电
    leftPlus (channel) {
      return this.setCurrent('leftPlus', channel)
    },
    // 右减电
    rightMinus (channel) {
      return this.setCurrent('rightMinus', channel)
    },
    // 右加电
    rightPlus (channel) {
      return this.setCurrent('rightPlus', channel)
    },
    // 左设电
    leftValue (channel, value) {
      return this.setCurrent('leftValue', channel, value)
    },
    // 右设电
    rightValue (channel, value) {
      return this.setCurrent('rightValue', channel, value)
    },
    // 下阶段
    nextPhase (channel) {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.nextPhase(channel)
    },
    // 开始训练
    startTreatment (channel, command = '') {
      console.log('开始训练')
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.startTreatment({ command, channel })
    },
    // 暂停治
    pauseTreatment (channel, command = '') {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.pauseTreatment({ command, channel })
    },
    // 结束训练
    endTreatment (channel, command = '') {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.endTreatment({ command, channel })
    },
    // 断开连接
    closeBLEConnection () {
      return this.BioStimBleModule.closeBLEConnection()
    },
    // 设置记录
    setRecord (recordId) {
      return this.BioStimBleModule.setRecord(recordId)
    },
    // 获取记录
    getRecord () {
      return this.BioStimBleModule.getRecord()
    },
    // 清除记录
    clearRecord () {
      return this.BioStimBleModule.clearRecord()
    },
    // 指令历史
    commandHistory () {
      return this.BioStimBleModule.commandHistory
    },
    // 设置指令发送完的callback
    commandCallback (id, fun, once) {
      return this.BioStimBleModule.commandCallback(id, fun, once)
    }
  }
}
