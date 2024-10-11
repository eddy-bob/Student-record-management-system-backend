import { DataSourceOptions } from 'typeorm';

export interface Config {
  port: number;
  nodeEnv: string;
  siteUrl: string;

  cors: {
    debugClient: string;
  };

  operator: {
    superAdminEmail: string;
    superAdminPassword: string;
  };

  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    type: DataSourceOptions;
    sync: boolean;
  };
  redis: {
    port: number;
    host: string;
    redis_url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
    cookieExpire: string;
  };
}
export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV,
  siteUrl: process.env.SITE_URL,
  cors: {
    debugClient: process.env.DEBUG_CLIENT,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    host: process.env.REDIS_HOST,
    redis_url: process.env.REDIS_URL,
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    type: process.env.DB_TYPE as unknown as DataSourceOptions,
    sync: process.env.SYNC as unknown as boolean,
  },
  operator: {
    superAdminEmail: process.env.DB_EMAIL,
    superAdminPassword: process.env.SUPER_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE,
    refreshSecret: process.env.REFRESH_JWT_SECRET,
    refreshExpiresIn: process.env.REFRESH_JWT_EXPIRE,
    cookieExpire: process.env.JWT_COOKIE_EXPIRE,
  },
});
