import { TypeOf, z } from "zod";

export const UpdateUserSchema = z.object({
  user: z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    email: z.string().email().optional(),
    bio: z.string().optional(),
    image: z.string().url().optional(),
  })
})

export type UpdateUser = TypeOf<typeof UpdateUserSchema>
