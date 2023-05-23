import { NextFunction, Request, Response } from "express";

import { validationError } from "../utils/errors";
import { checkPassword, generateAccessToken, hashPassword } from "../utils/auth";
import { LoginRequest, RegisterUserRequest } from "../requests/users.request";
import { getUserByEmail, getUserByUsername, getUserPassword, insertUser } from "../db/user";


export async function registerUser(req: Request, res: Response, next: NextFunction) {
    let reqBody: RegisterUserRequest = req.body;
    let { username, email, password } = reqBody.user;

    let emailExists = await getUserByEmail(email);
    if (emailExists !== null) {
        validationError(res, `Email '${email}' is already in use`);
        return;
    }

    let usernameExists = await getUserByUsername(username);
    if (usernameExists !== null) {
        validationError(res, `Username '${username}' is already in use`);
        return;
    }

    let hashedPassword: Buffer = await hashPassword(password);
    const token = generateAccessToken(username);

    let user = await insertUser(username, email, hashedPassword.toString());

    return res.status(200).json({
        user: { token: token, ...user }
    });
}

export async function loginUser(req: Request, res: Response) {
    let reqBody: LoginRequest = req.body;
    let { email, password } = reqBody.user;


    let dbPassword = await getUserPassword(email);

    if (dbPassword === null) {
        validationError(res, `Email '${email}' is not in use.`)
        return;
    }

    let passwordCorrect: boolean = await checkPassword(password, dbPassword!);
    if (!passwordCorrect) {
        validationError(res, "Incorrect password.");
    }

    let user = (await getUserByEmail(email))!;

    let token = generateAccessToken(user.username);

    res.status(200).json({ token, ...user })
}
