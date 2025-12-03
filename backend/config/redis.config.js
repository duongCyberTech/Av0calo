const dotenv = require('dotenv');
const Redis = require('ioredis');

dotenv.config();

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => {
  console.log('✅ Đã kết nối thành công tới Upstash Redis');
});

redis.on('error', (err) => {
  console.error('❌ Lỗi kết nối Redis:', err);
});

module.exports = redis;