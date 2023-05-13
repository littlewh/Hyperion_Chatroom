// redis.js
const redis = require('redis');
// const client = redis.createClient(6379, '127.0.0.1');
const redisPassword = "13245413324" ;
const client = redis.createClient({
  host : '127.0.0.1',
  no_ready_check: true,
  auth_pass: redisPassword,
});

client.selected_db = 1

// 配置redis的监听事件
// 准备连接redis-server事件
client.on('ready', () => {
  global.console.log("Redis:ready");
});

client.on('connect', () => {
  global.console.log("Redis:connected");
});

client.on('error', err => {
  global.console.log("Redis:"+err.message)
});

client.on('reconnecting', err => {
  global.console.log("Redis:"+err.message)
});
client.on('end', err => {
  global.console.log("Redis:"+err.message)
});

client.on('warning', err => {
  global.console.log("Redis:"+err.message)
});

// 导出redis-client对象
module.exports = client

