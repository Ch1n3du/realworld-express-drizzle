import { TypeOf, z, ZodObject, ZodRawShape, ZodType } from "zod";

export type Parser<Output> = (raw: any) => Output | null;

export function parseSchema<Output>(
    schema: ZodType<Output>,
): Parser<Output> {
    {
        return (rawRequest: any): Output | null => {
            try {
                return schema.parse(rawRequest);
            } catch (_) {
                return null;
            }
        }
    }
}