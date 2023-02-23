'use strict'
exports.main = async (loginRes) => {
  // loginRes 为获取一键登录后端传递的access_token和openid，具体变量可以通过console.log打印查看
  const res = await uniCloud.getPhoneNumber({
    ...loginRes, // loginRes包含appid,apiKey,apiSecret,access_token,openid
    // appid: '__UNI__F017811', // 替换成自己开通一键登录的应用的DCloud appid，使用callFunction方式调用时可以不传（会自动取当前客户端的appid），如果使用云函数URL化的方式访问必须传此参数
    provider: 'univerify',
    // apiKey: '2cbeb0083ca06ce71e0c8aa700f8da9b', // 在开发者中心开通服务并获取apiKey
    // apiSecret: '2523bede5154496dd21c9a9f68b2362c' // 在开发者中心开通服务并获取apiSecret
  })
  // 执行入库等操作，正常情况下不要把完整手机号返回给前端
  console.log(res)
  return {
    code: 0,
    message: '获取手机号成功',
    content: res // res里面包含了成功获取的真实手机号码
  }
}
