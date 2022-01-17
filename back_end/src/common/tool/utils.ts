// 昵称校验
export function nameVerify(name: string): boolean {
  // 数字、字母、下划线、汉字的正则表达式
  const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  if (name.length === 0) {
    return false
  }
  if (!nameReg.test(name)) {
    return false
  }
  if (name.length > 16) {
    return false
  }
  return true
}

// 引入crypto模块进项目
const crypto = require('crypto')

// sha256加盐处理password
export function sha256(str) {
  const m = crypto.createHash('sha256',crypto)
  m.update('YuyangGao')
  return m.digest('hex')
}
