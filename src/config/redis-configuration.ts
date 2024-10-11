import { ConfigObject } from '@nestjs/config';

export const getRedisConfiguration = (config: ConfigObject) => {
  const redisUrl = config.redis.redis_url;
  if (redisUrl) {
    const parsedUrl = new URL(redisUrl);

    return {
      host: parsedUrl.hostname,
      password: parsedUrl.password,
      port: Number(parsedUrl.port),
      tls: {
        rejectUnauthorized: false,
        requestCert: true,
      },
    };
  }

  return {
    host: config.redis.host,
    port: config.redis.port,
  };
};
