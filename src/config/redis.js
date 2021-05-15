const redis = require('express-redis-cache');

const cache = redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

cache.invalidate = (name) => (req, res, next) => {
  const routeName = name || req.url;

  if (!cache.connected) {
    next();
    return;
  }

  cache.del(routeName, (err) => console.log(err));

  next();
};

module.exports = cache;
