export function logger(req, res, next) {// 日志中间件
  const { method, path } = req
  console.log(`${method} ${path}`)
  next()
}
