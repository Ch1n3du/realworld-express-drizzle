import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();
const CONNECTION_STRING: string = process.env.DB_URL!;
const client = postgres(CONNECTION_STRING);
export const db = drizzle(client, { schema });