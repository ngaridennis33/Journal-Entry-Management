import jwt, { SignOptions } from "jsonwebtoken";
import { getEnvVariable } from "./helpers";

export const signJwt = (
    payload: object,
    keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options: SignOptions
) => {
const privateKey = Buffer.from(getEnvVariable(keyName), "base64").toString(
    "ascii"
    );
    return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
    });
};

export const verifyJwt = <T>(
    token: string,
    keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null => {
    try {
        const publicKey = Buffer.from(getEnvVariable(keyName), "base64").toString(
            "ascii"
        );
        
        const decoded = jwt.verify(token, publicKey) as T;

        return decoded;

    } catch (error) {
        return null
        
    }
}
