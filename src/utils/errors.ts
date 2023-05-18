import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { match } from "assert";
import { Response } from "express";

const formatError = (message: string) => {
    return {
        errors: {
            body: [message]
        }
    }
}

enum StatusCode {
    Ok = 200,
}

export function validationError(response: Response, message: string) {
    let error = formatError(message);
    response.status(422).json(error)
}

export function unauthorizedError(response: Response, message: string) {
    let error = formatError(message);
    response.status(401).json(error);
}

export function forbiddenError(response: Response, message: string) {
    let error = formatError(message);
    response.status(403).json(error)
}

export function notFoundError(response: Response, message: string) {
    let error = formatError(message);
    response.status(404).json(error)
}

export function handlePrismaError(res: Response, error: PrismaClientKnownRequestError) {
    console.log("Handling prisma error");

    let message: string;
    let field: Record<string, any> = error.meta!;
    let targets: string[] = field["target"];

    switch (error.code) {
        case "P2002":
            let target_field: string = targets[0];
            message = `Unique constraint failed on '${target_field}'`;
            validationError(res, message)

            return true;
            break;

        default:
            return false;
            break;
    }
}