// /api/users routes
import { Router } from "express";

const usersRouter = Router();
const todo = async () => "TODO";

// Authentication
// POST /api/users/login
usersRouter.post("/login", todo);

// Registration
// POST /api/users/
usersRouter.post("", todo);

export default usersRouter;