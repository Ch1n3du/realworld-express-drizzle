import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validationError } from "../utils/errors";
import { checkPassword, generateAccessToken, hashPassword } from "../utils/auth";
import { createUser } from "../models/user";

type RegisterRequest = {
    username: string,
    email: string,
    password: string
}
let prisma = new PrismaClient();

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    let { username, email, password }: RegisterRequest = req.body.user;

    let emailExists = await prisma.user.findFirst({ where: { email: email } });
    if (emailExists) {
        validationError(res, "Email is already in use");
        return;
    }

    let usernameExists = await prisma.user.findFirst({ where: { username: username } });
    if (usernameExists) {
        validationError(res, "Username is already in use");
        return;
    }

    let hashedPassword: Buffer = await hashPassword(password);
    const token = generateAccessToken(username);

    let user = await createUser(prisma, username, email, hashedPassword, token);

    return res.status(200).json(user);
}

type LoginRequest = {
    email: string,
    password: string,
}

export async function loginUser(req: Request, res: Response) {
    let { email, password }: LoginRequest = req.body.user;

    let rawUser = await prisma.user.findFirst({
        where: {
            email: email
        },
        select: {
            username: true,
            email: true,
            bio: true,
            image: true,
            password: true
        }
    });

    if (rawUser === null) {
        validationError(res, "Email is not in use.")
        return;
    }

    let user = rawUser!;
    let passwordCorrect: boolean = await checkPassword(password, user.password.toString());
    if (!passwordCorrect) {
        validationError(res, "Incorrect password.");
    }

    let token = generateAccessToken(user.username);

    res.status(200).json({ token, ...user })
}
