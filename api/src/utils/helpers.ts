import config from 'config';
import { Response } from 'express';


// 1. Get the Env Varibles.
export function getEnvVariable(key: string): string {
const value = config.get<string>(key)


if (!value || value.length === 0) {
console.error(`The environment variable ${key} is not set.`);
throw new Error(`The environment variable ${key} is not set.`);
}

return value;
}


// 2. Get the Time bases on the timezone.
export function getLocalTime() {
    const timeZone = config.get<string>('timezone');
    const time = new Date().toLocaleString('en-US', { timeZone });
    const adjustedTime = new Date(time);
    adjustedTime.setHours(adjustedTime.getHours() + 3); // Adjusting for UTC+3
    return adjustedTime;
}

// 3. Clear the cookies during logout
export function clearCookies(res: Response) {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.cookie('logged_in', '', { maxAge: 1 });
    // res.clearCookie("access",{
    //     sameSite:"none",
    //     secure:true,
    // })
}