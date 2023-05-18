import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "express-jwt";
import { unauthorizedError } from "../utils/errors";

export function jwtErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    /// Handle JWT errors well
    if (err instanceof UnauthorizedError) {
        unauthorizedError(res, "Invalid token");
    } else {
        next(err)
    }
}