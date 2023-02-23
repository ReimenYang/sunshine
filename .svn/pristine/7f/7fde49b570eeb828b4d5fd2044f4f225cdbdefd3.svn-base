
export default {
  data () {
    // 获取 module
    let bleModule = uni.requireNativePlugin('BleModule')
    return {
      searching: false,
      connected: false,
      equipment: '',
      equipmentList: [],
      bleModule: bleModule,
      workoutProject: {},
      tips: {
        search: {
          title: '蓝牙搜索中...',
          icon: 'loading',
          duration: 10000
        },
        connecting: {
          title: '蓝牙连接中...',
          icon: 'loading',
          duration: 10000
        },
        success: {
          title: '连接成功',
          icon: 'success'
        },
        break: {
          title: '蓝牙断开连接'
        },
        error: {
          title: '连接失败'
        }
      }
    }
  },
  created () {
    this.register()
  },
  methods: {
    showToast ({ title, icon = 'none', duration = 2000 }) {
      uni.hideToast()
      uni.showToast({ icon, title, duration })
    },
    register () {
      // 注册蓝牙监听器
      this.bleModule.registerBluetoothListener(ret => {
        let data = JSON.parse(ret.callBackData)
        let _return = false
        switch (ret.callBackType) {
          case 'didFoundPort':// 每搜索到一台蓝牙设备回调一次
            _return = this.foundPort(data)
            if (!_return) return
            this.showToast(this.tips.search)
            if (this.equipment.uuid === data.uuid) data.connected = true
            this.equipmentList.push(data)
            break
          case 'didFinishedEnumPorts':// 搜索蓝牙设备结束时回调
            this.searching = false
            uni.hideToast()
            _return = this.finishedPort(data)
            if (!_return) return
            this.equipmentList = data
            break
          case 'didClosePort':// 蓝牙连接后断开时回调
            this.connected = false
            console.log(this.tips.break)
            this.showToast(this.tips.break)
            _return = this.autoReConnect()
            if (!_return) return
            this.connect()
            break
          case 'didDeivceStatusPackageReceived':// 设备状态数据，蓝牙连接成功后会一直回调
          case 'didDeivceidPackageReceived':// 设备id数据，蓝牙连接成功后只回调一次
            this.getDeivceStatus(data)
            break
        }
      })
    },
    foundPort (item) {
      console.log('搜索到设备', item)
      return true
    },
    finishedPort (list) {
      console.log('完成搜索', list)
      return true
    },
    getDeivceStatus (item) {
      console.log(item)
    },
    autoReConnect () {
      console.log('重新连接')
      return true
    },
    search () {// 搜索设备
      this.searching = true
      this.equipmentList = []
      this.bleModule.startBluetoothDevicesDiscovery()
    },
    selectEquipment (item) {// 选择并连接设备
      this.equipment = item
      this.bleModule.stopBluetoothDevicesDiscovery()
      this.connect()
    },
    connect () {// 连接设备
      this.bleModule.closeBLEConnection()
      let deviceId = this.equipment.uuid
      this.showToast(this.tips.connecting)
      this.bleModule.createBLEConnection({
        'deviceId': deviceId
      },
        (res) => {
          console.log(res)
          console.log('连接蓝牙成功')
          this.connected = true
          this.showToast(this.tips.success)
        },
        (res) => {
          console.log(res)
          console.log('连接蓝牙失败')
          this.connected = true
          this.showToast(this.tips.error)
        })
    },
    selectProject (item) {// 选择计划
      this.workoutProject = item
      this.sendProject()
    },
    sendProject () {
      let workout = this.workoutProject
      // bleModule.getInitcommand({
      //                "initcommand":workout.initcommand,
      //    "time":120
      // }, (ret) => {
      // 	workout.initcommand = ret.initcommand; //修改治疗时长后，再设置初始化指令
      // 	bleModule.sendInitCmd(workout);
      // });
      this.bleModule.sendInitCmd(workout)
    },
    exitProject () {// 选择计划
      this.workoutProject = {}
      this.bleModule.endTreatment()
    },
    unRegister () {// 取消注册蓝牙监听器
      this.bleModule.unRegisterBluetoothListener()
    }
  }
}
