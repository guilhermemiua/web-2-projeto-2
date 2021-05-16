const redis = require('express-redis-cache');

const cache = redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

cache.invalidate = (name) => (req, res, next) => {
  if (!cache.connected) {
    next();
    return;
  }

  if (name) {
    cache.del(name, (err) => console.log(err));
  }

  if (req.url) {
    cache.del(req.url, (err) => console.log(err));
  }

  next();
};

module.exports = cache;
