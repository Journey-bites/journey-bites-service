declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    SALT_ROUNDS: string;
    DATABASE_URL: string;
    TOKEN_SECRET: string;
    TOKEN_EXPIRATION: string;
  }
}
