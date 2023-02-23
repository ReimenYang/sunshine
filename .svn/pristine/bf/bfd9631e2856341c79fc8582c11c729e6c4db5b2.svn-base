'use strict'
exports.main = async (event, context) => {
  let { name, appid, phone, expMinute = '3', action } = event
  // 作废未验证记录
  await uniCloud.callFunction({
    name: 'uniCloudApi',
    data: { actionType: 'jql', tableName: 'opendb-verify-codes', jqlAction: 'update', where: { appid, mobile: phone, state: 0 }, field: { state: 2 } }
  })
  // 创建新记录
  let _timestamp = new Date().valueOf()
  let code = (Math.floor(Math.random() * (10 ** 6 - 1 - 10 ** (6 - 1))) + 10 ** (6 - 1)).toString()
  let data = {
    ...event,
    actionType: 'jql', tableName: 'opendb-verify-codes', jqlAction: 'add', field: {
      appid, code,
      projectName: name,
      mobile: phone,
      scene: action,
      state: 0,
      'created_date': _timestamp,
      'expired_date': _timestamp + expMinute * 60 * 1000
    }
  }

  let res = (await uniCloud.callFunction({ name: 'uniCloudApi', data })).result
  console.log('生成手机短信验证码：', data, res)
  // 返回数据给客户端
  return code
}
