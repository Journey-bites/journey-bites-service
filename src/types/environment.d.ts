declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    SALT_ROUNDS: string;
    DATABASE_URL: string;
    TOKEN_SECRET: string;
    REDIS_URI: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_LOGIN_CALL_BACK_URL: string;
    CLIENT_URL: string;
    HOST: string;
    NEWEBPAY_VERSION: string;
    NEWEBPAY_MERCHANT_ID: string;
    NEWEBPAY_HASH_KEY: string;
    NEWEBPAY_HASH_IV: string;
  }
}
