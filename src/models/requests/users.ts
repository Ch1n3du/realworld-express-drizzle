import { TypeOf, z } from "zod";
import { parseSchema, Parser } from "../parse";

const LoginRequestSchema = z.object({
    email: z.string(),
    password: z.string(),
});
export type LoginRequest = TypeOf<typeof LoginRequestSchema>;
export const parseLoginRequest: Parser<LoginRequest> = parseSchema(LoginRequestSchema);


const RegisterRequestSchema = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string()
});
export type RegisterRequest = TypeOf<typeof RegisterRequestSchema>;
export const parseRegisterRequest: Parser<RegisterRequest> = parseSchema(RegisterRequestSchema);