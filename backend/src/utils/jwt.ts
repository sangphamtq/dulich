import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

export interface JWTPayload {
    userId: string;
    email?: string;
    type?: string;
}

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return secret;
};

export const signToken = (
    payload: JWTPayload,
    expiresIn: jwt.SignOptions["expiresIn"] = "7d"
): string => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
};
