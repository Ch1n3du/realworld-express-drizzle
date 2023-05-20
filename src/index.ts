import express, { Express } from "express";
import dotenv from 'dotenv';

import router from "./routes";
import { jwtErrorHandler } from "./middleware/jwt_error_handler";

dotenv.config();
const PORT = process.env.PORT;

const app: Express = express();
app.use(express.json());
app.use(jwtErrorHandler);
app.use("/api", router);

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
})
