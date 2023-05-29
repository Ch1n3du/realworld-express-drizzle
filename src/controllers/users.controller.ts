import { NextFunction, Request, Response } from "express";
import { TypeOf, z } from "zod";

import * as errors from "../utils/errors";
import * as auth from "../utils/auth";
import * as db from "../db/user";


export const RegisterUserSchema = z.object({
    user: z.object({
        username: z.string(),
        email: z.string(),
        password: z.string()
    })
});
type RegisterUserRequest = TypeOf<typeof RegisterUserSchema>;

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    let reqBody: RegisterUserRequest = req.body;
    let { username, email, password } = reqBody.user;

    let emailExists = await db.getUserByEmail(email);
    if (emailExists !== null) {
        errors.validationError(res, `Email '${email}' is already in use`);
        return;
    }

    let hashedPassword: Buffer = await auth.hashPassword(password);
    const token = auth.generateAccessToken(username);

    let user = await db.insertUser(username, email, hashedPassword.toString());
    if (user !== null) {
        errors.validationError(res, `Username '${username}' is already in use`);
        return;
    }

    return res.status(200).json({
        user: { token: token, ...(user!) }
    });
}

export const LoginSchema = z.object({
    user: z.object({
        email: z.string(),
        password: z.string(),
    })
});
type LoginRequest = TypeOf<typeof LoginSchema>;


export async function loginUser(req: Request, res: Response) {
    let reqBody: LoginRequest = req.body;
    let { email, password } = reqBody.user;

    let dbPassword = await db.getUserPassword(email);
    if (dbPassword === null) {
        errors.validationError(res, `Email '${email}' is not in use.`)
        return;
    }

    let passwordCorrect: boolean = await auth.checkPassword(password, dbPassword!);
    if (!passwordCorrect) {
        errors.validationError(res, "Incorrect password.");
    }

    let user = (await db.getUserByEmail(email))!;
    let token = auth.generateAccessToken(user.username);

    res.status(200).json({ token, ...user })
}
