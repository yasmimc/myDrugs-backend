import { Router } from "express";
import { logout } from "./controllers/Sessions.js";
import { signIn, signUp } from "./controllers/usersController.js";
import validateToken from "./middlewares/tokenValidator.js";

const routes = Router();

routes.post("/sign-up", signUp);
routes.post("/sign-in", signIn);
routes.delete("/sessions", validateToken, logout);

export default routes;
