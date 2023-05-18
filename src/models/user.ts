import { PrismaClient } from "@prisma/client";
import { unauthorizedError } from "../utils/errors";
import * as responses from "./responses"

export async function createUser(
    prisma: PrismaClient,
    username: string,
    email: string,
    password: Buffer,
    token: string
): Promise<responses.User> {
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password
        }
    });

    let userResponse: responses.User = {
        username: user.username,
        email: user.email,
        token: token,
        bio: user.bio || "",
        image: user.image
    };

    return userResponse
}