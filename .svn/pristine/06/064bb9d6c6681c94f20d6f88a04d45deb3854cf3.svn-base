'use strict'
exports.main = async (event, context) => {
  let { appid, code, phone } = event
  if (!phone) return { code: 501, message: '手机不能为空', content: {} }
  if (!code) return { code: 502, message: '验证码不能为空', content: {} }
  if (!appid) return { code: 503, message: 'appid不能为空', content: {} }
  let data = { actionType: 'jql', tableName: 'opendb-verify-codes', jqlAction: 'select', where: { appid, mobile: String(phone), code: String(code), state: 0 }, field: { state: 1 } }
  // 查询记录
  let record = await uniCloud.callFunction({ name: 'uniCloudApi', data })
  let target = record.result.content.data[0]
  if (!target) return { code: 504, message: '验证码无效', content: {} }
  if (target.expired_date < new Date()) return { code: 505, message: '验证码已过期', content: {} }
  // 更新记录
  data.jqlAction = 'update'
  data.where._id = target._id
  await uniCloud.callFunction({ name: 'uniCloudApi', data })
  return { code: 200, message: '手机验证通过', content: {} }
}
