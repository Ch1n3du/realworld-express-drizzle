import { TypeOf, z } from "zod";

export const LoginSchema = z.object({
    user: z.object({
        email: z.string(),
        password: z.string(),
    })
});
export type LoginRequest = TypeOf<typeof LoginSchema>;


export const RegisterUserSchema = z.object({
    user: z.object({
        username: z.string(),
        email: z.string(),
        password: z.string()
    })
});
export type RegisterUserRequest = TypeOf<typeof RegisterUserSchema>;
