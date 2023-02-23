'use strict'
exports.main = async (event, context) => {
  // event为客户端上传的参数
  let { actionType,
    name, code, expMinute = '3', action, // sendSms
    jqlAction, tableName, where, field // jql
  } = event
  let res = { code: 0, message: '', content: {} }
  let dbJQL = uniCloud.databaseForJQL({ event, context })
  switch (actionType) {
    case 'sendSms':
      if (!code) code = (await uniCloud.callFunction({ name: 'getSmsCode', data: event })).result
      res.content = (await uniCloud.sendSms({ ...event, data: { name, code, expMinute, action } })).result
      res.message = '短信发送'
      console.log('短信发送结果 : ', res.content)
      break
    case 'getPhoneNumber':
      res.content = await uniCloud.getPhoneNumber(event)
      res.message = '一键登录'
      console.log('一键登录结果 : ', res.content.phoneNumber)
      break
    case 'jql':
      if (jqlAction === 'add') res.content = await dbJQL.collection(tableName).add(field)
      if (jqlAction === 'select') res.content = await dbJQL.collection(tableName).where(where).get()
      if (jqlAction === 'update') res.content = await dbJQL.collection(tableName).where(where).update(field)
      if (jqlAction === 'remove') res.content = await dbJQL.collection(tableName).where(where).remove()
      res.message = 'jql数据库'
      console.log('jql处理结果 : ', res.content)
      break
  }
  // 返回数据给客户端
  return res
}
