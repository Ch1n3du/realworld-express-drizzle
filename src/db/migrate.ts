import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config()

async function main() {
    const sql = postgres(process.env.DB_URL!, { max: 1 });
    const db = drizzle(sql)

    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("✅ Succesfully ran migration");
    return;
}

main()