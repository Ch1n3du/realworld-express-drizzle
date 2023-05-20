import { TypeOf, z } from "zod";

export const UpdateUserSchema = z.object({
    user: z.object({
        email: z.string(),
        bio: z.string(),
        image: z.string(),
    })
})

export type UpdateUserRequest = TypeOf<typeof UpdateUserSchema>;