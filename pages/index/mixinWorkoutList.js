export default {
  data () {
    return {
      workoutList: [],
    }
  },
  methods: {
    async getWorkoutList () {
      // deviceTypeId 设备类型id
      // 14:DJZ-A
      // 15:ble
      // 16:优E康
      let params = {
        pageSize: 100,
        deviceTypeId: '16',
        // composeName: 'ble2',
        // workoutNameOrDesc: 'ee6'// 测试用
        isNewDevice: this.libs.configProject.isNewDevice,
        phone: this.globalData.userInfo.phone
      }
      this.globalData.workoutList = (
        await this.request(
          this.api.ECirculation.scheme.getSchemeList,
          params
        )
      ).data
      this.globalData.workoutList.forEach(item => {
        // let note = ''
        // if (item.todayState === 'Y') note = '（今天已训练）'
        item.workoutName = item.name
        item.workoutDescription = item.description
        item.workoutId = item.id
        item.title = item.workoutName // + note,
        item.tags = [{ txt: '训练' }]
        item.contents = [
          {
            txt: `训练时长 ${item.duration / 60}分钟`
          },
          {
            txt: item.workoutDescription
          }
        ]
        item.channelList.forEach(channelItem => {
          channelItem.spliceList.forEach(obj => {
            obj.channel = channelItem.channel
            obj.current = '0.0'
            obj.side = obj.spliceNum === 1 ? 'settingCHL' : 'settingCHR'
          })
        })
      })
      this.workoutList = this.globalData.workoutList
      // 过滤多通道方案，易循环特有
      // this.workoutList = this.globalData.workoutList.filter(item =>
      //   item.deviceType.split(',').includes(this.globalData.device.mode)
      // )
    }
  }
}
