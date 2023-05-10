const apis = {
  getSystemData: { method: 'POST', url: 'system/getSystemData', group: 'ECirculation', dataType: 'keyValue' },
  getDeviceCoreTypeList: { method: 'POST', url: 'system/getDeviceCoreTypeList', group: 'ECirculation', dataType: 'keyValue' },
  getDeviceCoreList: { method: 'POST', url: 'system/getDeviceCoreList', group: 'ECirculation', dataType: 'keyValue' }
}

export default apis
