<template>
  <view class="wrap">
    <uni-collapse>
      <uni-collapse-item title="预置方法">
        <view
          v-for="item in control"
          :key="item.name"
          class="item"
        >
          <view class="left">
            {{ item.tips }}
          </view>
          <button
            class="right"
            type="primary"
            :loading="searching"
            @click="item.fun"
          >
            {{ item.name }}
          </button>
        </view>
      </uni-collapse-item>
      <uni-collapse-item title="预置变量">
        <view
          v-for="key in Object.keys(defaultKey)"
          :key="key"
        >
          <text class="key">
            {{ key }}:
          </text>{{ defaultKey[key] }}
        </view>
      </uni-collapse-item>
      <uni-collapse-item title="预置提示">
        <view
          v-for="key in Object.keys(tips)"
          :key="key"
        >
          <text class="key">
            {{ key }}:
          </text>{{ tips[key].title }}
        </view>
      </uni-collapse-item>
      <uni-collapse-item title="自定义训练程序">
        <uni-collapse-item title="程序参数">
          <view
            v-for="key in Object.keys(setProject)"
            :key="key"
          >
            <text
              class="key"
              v-if="key!=='workoutphaselist'"
            >
              {{ key }}:
            </text>
            <input
              v-if="key!=='workoutphaselist'"
              v-model="setProject[key]"
              class="input"
            >
          </view>
        </uni-collapse-item>

        <view class="title">
          训练参数workoutphaselist
        </view>
        <view
          v-for="(item,index) in setProject.workoutphaselist"
          :key="index"
        >
          <uni-collapse-item
            :title="`第${index+1}阶段:`"
            :open="true"
          >
            <view
              v-for="obj in item.phasecommandValue"
              :key="obj.key"
            >
              <text class="key">
                {{ obj.name }}:
              </text>
              <input
                v-model="obj.value"
                class="input"
                @input="inputValue(item)"
              >
            </view>
            <uni-collapse-item title="更多参数">
              <view
                v-for="key in Object.keys(item)"
                :key="key"
              >
                <text
                  class="key"
                  v-if="key!=='phasecommandValue'"
                >
                  {{ key }}:
                </text>
                <input
                  v-if="key!=='phasecommandValue'"
                  v-model="item[key]"
                  class="input"
                >
              </view>
            </uni-collapse-item>
          </uni-collapse-item>
        </view>
        <view class="btnGroup">
          <button
            v-for="btn in controlConnect"
            @click="btn.fun"
            class="btn"
            :key="btn.name"
          >
            {{ btn.name }}
          </button>
        </view>
        <view class="btnGroup">
          <button
            v-for="btn in controlProject"
            @click="btn.fun"
            class="btn"
            :key="btn.name"
          >
            {{ btn.name }}
          </button>
        </view>
        <view class="btnGroup">
          <button
            v-for="btn in controlProcess"
            @click="btn.fun"
            class="btn"
            :key="btn.name"
          >
            {{ btn.name }}
          </button>
        </view>
      </uni-collapse-item>
    </uni-collapse>
    <view class="box">
      <view class="title">
        设备信息
      </view>
      <view v-if="equipment">
        {{ `${connected ? '已连接设备' : '已选择设备'} : ${equipment.localName} (${equipment.uuid})` }}
      </view>
      <view v-if="Object.keys(workoutProject).length > 0">
        {{ '已选择程序: ' + workoutProject.name + '(共' + workoutProject.workoutphaselist.length + '个阶段)' }}
      </view>
      <view
        v-for="key in Object.keys(deivceStatus)"
        :key="key"
      >
        {{ key }}:{{ deivceStatus[key] }}
      </view>
    </view>
    <!-- 遮罩 -->
    <view
      v-if="showMaskType"
      class="uni-mask"
      @click="maskclose"
    >
      <scroll-view
        class="uni-scroll_box"
        scrollY
        v-if="showMaskType === 'device'"
      >
        <view class="uni-title">
          已经发现{{ equipmentList.length }}台设备:
        </view>
        <view
          class="uni-list-box"
          v-for="(item, index) in equipmentList"
          :key="index"
          @click="selectEquipment(item)"
        >
          <view class="uni-list_name">
            {{ item.localName }}<text v-if="item.connected">
              (已连接)
            </text>
          </view>
          <view class="uni-list_item">
            电量:{{ item.deviceHasPower }}
          </view>
          <view class="uni-list_item">
            UUID:{{ item.uuid }}
          </view>
        </view>
      </scroll-view>
      <scroll-view
        class="uni-scroll_box"
        scrollY
        v-if="showMaskType === 'workout'"
      >
        <view class="uni-title">
          训练程序列表:
        </view>
        <view
          class="uni-list-box"
          v-for="(item, index) in workoutList"
          :key="index"
          @click="selectProject(item)"
        >
          <view class="uni-list_name">
            {{ item.name }}
          </view>
          <view class="uni-list_item">
            {{ item.description }}
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
// 获取 module
import bleModules from '@/nativeplugins/BleModule.js'
import workoutData from './workoutData.js'
export default {
  data () {
    return {
      title: 'bluetooth',
      showMaskType: '',
      workoutList: workoutData.data,
      deivceStatus: {},
      control: [],
      defaultKey: {
        searching: '搜索蓝牙设备状态，布尔值',
        connected: '蓝牙设备连接状态，布尔值',
        equipment: '当前或最近一次连接设备，object',
        equipmentList: '搜索到的蓝牙设备列表，array',
        bleModule: '原生api提供的接口',
        workoutProject: '已选的训练程序，object',
        tips: '默认提示语'
      },
      setValue: [
        { name: '阶段', key: 'NumPhase', value: 1 },
        { name: '波形类型', key: 'Waveform', value: 1 },
        { name: '脉冲频率', key: 'Frequency', value: 80 },
        { name: '脉冲宽度', key: 'PulseWidth', value: 150 },
        { name: '上升时间', key: 'RampUpTime', value: 0 },
        { name: '平台时间', key: 'SteadyTime', value: 10 },
        { name: '下降时间', key: 'RampDownTime', value: 0 },
        { name: '休息时间', key: 'RestTime', value: 0 },
      ],
      setStep: {},
      setProject: {},
      demoControl: []
    }
  },
  mixins: [bleModules],
  created () {
    this.control = [
      { name: '搜索蓝牙设备', fun: this.search, from: 'components', tips: '启动搜索蓝牙设备程序' },
      { name: '选择蓝牙设备', fun: this.selectEquipment, from: 'components', tips: '选择并自动连接所选设备' },
      { name: '连接蓝牙设备', fun: this.connect, from: 'components', tips: '手动连接设备,需先选择设备' },
      { name: '显示训练程序', fun: this.selectWorkOut, from: 'demo', tips: 'demo演示显示可选训练程序' },
      { name: '选择训练程序', fun: this.selectProject, from: 'components', tips: '选择并自动发送训练程序到设备，需先连接设备' },
      { name: '发送训练程序', fun: this.sendProject, from: 'components', tips: '手动发送训练程序到设备，需先连接设备及选择训练程序' },
      { name: '退出训练程序', fun: this.exitProject, from: 'components', tips: '退出训练，需先连接蓝牙并发送训练程序' },
      { name: '左电流+', fun: this.bleModule.addLeftMa, from: 'api', tips: '加左电流，需先连接蓝牙并发送训练程序' },
      { name: '左电流-', fun: this.bleModule.subLeftMa, from: 'api', tips: '减左电流，需先连接蓝牙并发送训练程序' },
      { name: '右电流+', fun: this.bleModule.addRightMa, from: 'api', tips: '加右电流，需先连接蓝牙并发送训练程序' },
      { name: '右电流-', fun: this.bleModule.subRightMa, from: 'api', tips: '减右电流，需先连接蓝牙并发送训练程序' },
      { name: '下一阶段', fun: this.bleModule.nextPhase, from: 'api', tips: '当前训练程序的阶段，需先连接蓝牙并发送训练程序' },
      { name: '开始训练', fun: this.bleModule.startTreatment, from: 'api', tips: '开始训练，需先连接蓝牙并发送训练程序' },
      { name: '暂停训练', fun: this.bleModule.pauseTreatment, from: 'api', tips: '暂停训练，需先开始训练' },
      { name: '断开蓝牙设备', fun: this.bleModule.closeBLEConnection, from: 'api', tips: '断开蓝牙设备，需先连接蓝牙' }
    ]
    this.controlConnect = [
      { name: '搜索设备', fun: this.search },
      { name: '添加阶段', fun: this.addStep },
      { name: '重置参数', fun: this.reset },
      { name: '发送程序', fun: this.sendStep },
      { name: '退出程序', fun: this.exitProject }
    ]
    this.controlProject = [
      { name: '左电流+', fun: this.bleModule.addLeftMa },
      { name: '左电流-', fun: this.bleModule.subLeftMa },
      { name: '右电流+', fun: this.bleModule.addRightMa },
      { name: '右电流-', fun: this.bleModule.subRightMa },
      { name: '下一阶段', fun: this.bleModule.nextPhase }
    ]
    this.controlProcess = [
      { name: '开始训练', fun: this.bleModule.startTreatment },
      { name: '暂停训练', fun: this.bleModule.pauseTreatment },
      { name: '断开设备', fun: this.bleModule.closeBLEConnection }
    ]
    console.log(this.workoutList[2])
    this.setProject = JSON.parse(JSON.stringify(this.workoutList[2]))
    this.setStep = JSON.parse(JSON.stringify(this.setProject.workoutphaselist[0]))
    this.setProject.workoutphaselist = []
    this.addStep()
  },
  methods: {
    foundPort (item) {// 每搜索到一台蓝牙设备回调一次
      this.showMaskType = 'device'
      if (typeof item.deviceHasPower === 'undefined') return
      return true
    },
    finishedPort (list) {// 搜索蓝牙设备结束时回调
      console.log('完成', list)
      return
    },
    getDeivceStatus (item) {// 设备状态数据，蓝牙连接成功后会一直回调
      this.deivceStatus = item
      // console.log(item)
    },
    autoReConnect () {// 蓝牙连接后断开时回调
      console.log('不要重新连接')
      return
    },
    /**
     * 关闭遮罩
     */
    maskclose () {
      this.showMaskType = false
      this.bleModule.stopBluetoothDevicesDiscovery()
    },
    /**
     * 选择程序
     */
    selectWorkOut () {
      // this.newDeviceLoad = true;
      this.showMaskType = 'workout'
    },
    addStep () {
      let workoutphaselist = this.setProject.workoutphaselist
      let order = workoutphaselist.length + 1
      this.setValue.find(item => item.key === 'NumPhase').value = this.setStep.phaseid = this.setStep.seqno = order
      this.setStep.phasename = 'PH0' + order
      this.setStep.phasecommandValue = JSON.parse(JSON.stringify(this.setValue))
      this.inputValue(this.setStep)
      workoutphaselist.push(JSON.parse(JSON.stringify(this.setStep)))
      this.setProject.workoutphasetotal = order
      this.setProject.initcommand = 'DATA:m,' + order + ',0,1800,' + (109 + 1800 + order) + '\\r\\n\\0'
    },
    inputValue (obj) {
      let num = obj.phasecommandValue.map(item => item.value)
      obj.phasecommand = 'DATA:p,' + num.join() + ',' + (num.reduce((a, b) => Number(a) + Number(b)) + 112) + '\\r\\n\\0'
    },
    sendStep () {
      let workoutphaselist = JSON.parse(JSON.stringify(this.setProject.workoutphaselist))
      // workoutphaselist.forEach(item => {
      //   delete item.phasecommandValue
      // });
      this.setProject.workoutphaselist = workoutphaselist
      console.log(this.setProject)
      this.workoutProject = this.setProject
      this.sendProject()
    },
    reset () {
      this.setProject.workoutphaselist = []
      this.addStep()
    }
  }
}
</script>

<style>
.wrap {
  background-color: #f8f8f8;
  line-height: 2.5;
}
.box {
  margin: 10rpx 0;
  padding: 20rpx;
  background-color: #fff;
}
.title {
  font-size: 32rpx;
  border-bottom: 1px solid #ddd;
}
.item {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  line-height: 1;
}
.left {
  flex: 1;
}
.right {
  width: 10em;
  margin: 0.5em;
}
.key {
  width: 12em;
  padding-right: 1em;
  display: inline-block;
  text-align: right;
}
.input {
  width: 20em;
  vertical-align: middle;
  display: inline-block;
  border: 1px solid;
}
.uni-title {
  /* width: 100%; */
  /* height: 80rpx; */
  text-align: center;
}

.uni-mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  padding: 0 30rpx;
  box-sizing: border-box;
}

.uni-scroll_box {
  height: 70%;
  background: #fff;
  border-radius: 20rpx;
}

.uni-list-box {
  margin: 0 20rpx;
  padding: 15rpx 0;
  border-bottom: 1px #f5f5f5 solid;
  box-sizing: border-box;
}

.uni-list:last-child {
  border: none;
}

.uni-list_name {
  font-size: 30rpx;
  color: #333;
}

.uni-list_item {
  font-size: 24rpx;
  color: #555;
  line-height: 1.5;
}
</style>
