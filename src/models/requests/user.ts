import { TypeOf, z } from "zod";
import { Parser, parseSchema } from "../parse";

const UpdateRequestSchema = z.object({
    email: z.string(),
    bio: z.string(),
    image: z.string(),
})

export type UpdateRequest = TypeOf<typeof UpdateRequestSchema>;
export const parseUpdateRequest: Parser<UpdateRequest> = parseSchema(UpdateRequestSchema);