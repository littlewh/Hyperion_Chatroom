// redis-client.js
// 引用redisClient对象
const redisClient = require('./redis')

/**
 * redis setString function
 * @param key
 * @param value
 * @param expire
 */
const setString = (key, value, expire) => {
  return new Promise((resolve, reject) => {
    redisClient.set(key, value, function (err, result) {
      if (err) {
        reject(err)
      }

      if (!isNaN(expire) && expire > 0) {
        redisClient.expire(key, parseInt(expire))
      }
      resolve(result)
    })
  })
}

/**
 * redis getString function
 * @param key
 */
const getString = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, function (err, result) {
      if (err) {
        reject(err)
      }
      // console.log(key+" "+err+" "+result)
      resolve(result)
    })
  })
}
/**
 * redis exitsString function
 * @param key
 */
const exitsString = (key) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      const flag = redisClient.exists(key);// exists("key") 判斷key是否过期
      if(flag === true){
        resolve(flag)
      }else {
        reject(flag)
      }

      // console.log(flag);
    },100);
  })
}
/**
 * redis removeString function
 * @param key
 */
const removeString = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, function (err, result) {
      if (err) {
        reject(err)
      }
      redisClient.expire(key, parseInt(String(-1)))
      resolve(result)
    })
  })
}
/**
 * redis rpush function
 * @param key
 * @param token
 */
// rpush 将给定值推入列表的右端 返回值 当前列表长度
const rpush = (key, token) => {
  return new Promise((resolve, reject) => {
    redisClient.rpush(key, [token], function (err, result) {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}
/**
 * redis lrange function
 * @param key
 * @param startIndex
 * @param stopIndex
 */
// 查询list的值
const lrange = (key, startIndex = 0, stopIndex = -1) => {
  return new Promise((resolve, reject) => {
    redisClient.lrange(key, startIndex, stopIndex, function (err, result) {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}
/**
 * redis lrem function
 * @param key
 * @param n
 * @param value
 */
// 清除list中n个值为value的项
const lrem = (key, n = 1, value) => {
  return new Promise((resolve, reject) => {
    redisClient.lrem(key, n, value, function (err, result) {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

module.exports = {
  getString,
  setString,
  exitsString,
  removeString,
  rpush,
  lrange,
  lrem,
}

