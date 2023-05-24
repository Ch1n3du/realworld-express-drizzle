import { Request, Response } from "express";
import { decodeAccesToken, extractAccesToken } from "../utils/auth";
import { validationError } from "../utils/errors";
import * as db from "../db/user";
import { UpdateUser } from "../requests/user.request";

export async function getCurrentUser(req: Request, res: Response) {
  let token: string = extractAccesToken(req);
  let decodeResult: string | null = decodeAccesToken(token);
  if (decodeResult === null) {
    validationError(res, "Error decoding JWT");
    return;
  }
  let username: string = decodeResult!;

  let searchResult = await db.getUserByUsername(username);
  if (searchResult === null) {
    validationError(res, `Username '${username}' is not in use`);
    return;
  }

  let user = searchResult!;
  res.status(200).send({ token, ...user })
}

export async function updateUser(req: Request, res: Response) {
  let token: string = extractAccesToken(req);
  let decodeResult: string | null = decodeAccesToken(token);
  if (decodeResult === null) {
    validationError(res, "Error decoding JWT");
    return;
  }
  let username: string = decodeResult!;

  let reqBody: UpdateUser = req.body;
  let updateArguments = reqBody.user;

  let user = await db.updateUser(username, updateArguments);
  res
    .status(200)
    .json({ token: token, ...user });
}

