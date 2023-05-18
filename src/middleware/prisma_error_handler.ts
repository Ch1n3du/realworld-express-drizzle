import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextFunction, Request, Response } from "express";
import { unauthorizedError } from "../utils/errors";

// export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
//     /// Handle JWT errors well
//     if (err instanceof PrismaClientUnknownRequestError) {
//         unauthorizedError(res, "Invalid token");
//     } else {
//         next(err)
//     }
// }


export default async function prismaErrorHandler(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("Running prisma error handler");


    if (err instanceof PrismaClientKnownRequestError) {

        let error = err as PrismaClientKnownRequestError
        switch (error.code) {
            case "P2002":
                return res
                    .status(422)
                    .json({ errors: [`the field ${error.meta?.target} is not unique`] });
            case "P2025":
                return res.status(422).json({
                    errors: [`${error.meta?.cause}`],
                });
            default:
                return res.sendStatus(500);
        }

    } else {
        next(err)
    }
}