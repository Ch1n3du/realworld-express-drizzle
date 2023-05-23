import * as bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

dotenv.config();

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<Buffer> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(password, salt)

    return Buffer.from(hashedPassword)
}

export async function checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}


export function generateAccessToken(username: string) {
    dotenv.config();
    const SECRET: string = process.env.JWT_SECRET!;

    const options: jwt.SignOptions = {
        expiresIn: "1800s"
    };

    return jwt.sign(username, SECRET);
}

export function extractAccesToken(response: Request): string {
    let authHeader: string = response.headers.authorization!;
    let token: string = authHeader.split(" ")[1];

    return token;
}

export function decodeAccesToken(token: string): string | null {
    let decodeResult = jwt.decode(token);
    if (decodeResult === null) {
        return null;
    } else {
        return decodeResult as string
    }
}

