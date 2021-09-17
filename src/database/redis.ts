import Redis from 'ioredis';

const { REDIS_PORT, REDIS_HOSTNAME, REDIS_PASSWORD } = process.env;

export default new Redis({
  port: Number(REDIS_PORT),
  host: REDIS_HOSTNAME,
  password: REDIS_PASSWORD,
});
