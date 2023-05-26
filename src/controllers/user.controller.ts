import { Request, Response } from "express";
import { TypeOf, z } from "zod";

import * as auth from "../utils/auth";
import * as errors from "../utils/errors";
import * as db from "../db/user";

export async function getCurrentUser(req: Request, res: Response) {
  let token: string = auth.extractAccesToken(req);

  let decodeResult: string | null = auth.decodeAccesToken(token);
  if (decodeResult === null) {
    errors.validationError(res, "Error decoding JWT");
    return;
  }
  let username: string = decodeResult!;

  let searchResult = await db.getUserByUsername(username);
  if (searchResult === null) {
    errors.validationError(res, `Username '${username}' is not in use`);
    return;
  }

  let user = searchResult!;
  res.status(200).send({ token, ...user })
}

export const UpdateUserSchema = z.object({
  user: z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    email: z.string().email().optional(),
    bio: z.string().optional(),
    image: z.string().url().optional(),
  })
})

type UpdateUser = TypeOf<typeof UpdateUserSchema>

export async function updateUser(req: Request, res: Response) {
  let token: string = auth.extractAccesToken(req);
  let decodeResult: string | null = auth.decodeAccesToken(token);
  if (decodeResult === null) {
    errors.validationError(res, "Error decoding JWT");
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

