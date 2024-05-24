declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    SALT_ROUNDS: string;
    DATABASE_URL: string;
    TOKEN_SECRET: string;
    REDIS_URI: string;
    HOST: string;
  }
}
