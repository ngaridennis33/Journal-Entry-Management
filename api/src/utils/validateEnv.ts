import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        DATABASE_URL: str(),

        PORT: port(),
        NODE_ENV: str(),

        DB_HOST: str(),
        DB_PORT: port(),
        DB_USER: str(),
        DB_PASSWORD: str(),
        DB_NAME: str(),

        JWT_ACCESS_TOKEN_PRIVATE_KEY: str(),
        JWT_ACCESS_TOKEN_PUBLIC_KEY: str(),
        JWT_REFRESH_TOKEN_PRIVATE_KEY: str(),
        JWT_REFRESH_TOKEN_PUBLIC_KEY: str(),

        EMAIL_USER: str(),
        EMAIL_PASS: str(),
        EMAIL_HOST: str(),
        EMAIL_PORT: port(),
    });
}

export default validateEnv;