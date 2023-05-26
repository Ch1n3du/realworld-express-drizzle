import { Request, Response } from "express";
import { followUser, getProfile, Profile, unfollowUser } from "../db/profile";
import { decodeAccesToken, extractAccesToken } from "../utils/auth";
import { ErrorMessage, notFoundError, validationError } from "../utils/errors";

export async function getProfileController(req: Request, res: Response) {
    let token: string = extractAccesToken(req);
    let decodeResult: string | null = decodeAccesToken(token)
    if (decodeResult === null) {
        validationError(res, ErrorMessage.JWT_PARSE_ERROR)
        return;
    }
    let searcherUsername: string = decodeResult!;
    let targetUsername: string = req.params.username;

    let dbResult: Profile | null = await getProfile(searcherUsername, targetUsername);
    if (dbResult === null) {
        notFoundError(res, ErrorMessage.PROFILE_NOT_FOUND);
        return;
    }
    let profile: Profile = dbResult!;

    res.status(200).json({
        profile: profile
    });
}


export async function followUserController(req: Request, res: Response) {
    let token: string = extractAccesToken(req);
    let decodeResult: string | null = decodeAccesToken(token)
    if (decodeResult === null) {
        validationError(res, ErrorMessage.JWT_PARSE_ERROR)
        return;
    }
    let username: string = decodeResult!;
    let targetUsername: string = req.params.username;

    let dbResult: Profile | null = await followUser(username, targetUsername);
    if (dbResult === null) {
        notFoundError(res, ErrorMessage.PROFILE_NOT_FOUND);
        return;
    }
    let profile: Profile = dbResult!;

    res.status(200).json({
        profile: profile
    });
}

export async function unfollowUserController(req: Request, res: Response) {
    let token: string = extractAccesToken(req);
    let decodeResult: string | null = decodeAccesToken(token)
    if (decodeResult === null) {
        validationError(res, ErrorMessage.JWT_PARSE_ERROR)
        return;
    }
    let username: string = decodeResult!;
    let targetUsername: string = req.params.username;

    let dbResult: Profile | null = await unfollowUser(username, targetUsername);
    if (dbResult === null) {
        notFoundError(res, ErrorMessage.PROFILE_NOT_FOUND);
        return;
    }
    let profile: Profile = dbResult!;

    res.status(200).json({
        profile: profile
    });
}
