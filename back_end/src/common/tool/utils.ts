// 昵称校验

export function nameVerify(name: string): boolean {
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

// 获取文件大小

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]
}

// 引入crypto模块进项目
const crypto = require('crypto')

// sha256加盐处理password
export function sha256(str) {
  const m = crypto.createHash('sha256',crypto)
  m.update('YuyangGao')
  return m.digest('hex')
}
