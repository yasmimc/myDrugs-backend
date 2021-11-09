import { Router } from "express";
import { logout } from "./controllers/Sessions.js";
import { signUp } from "./controllers/usersController.js";
import validateToken from "./middlewares/tokenValidator.js";

const routes = Router();

routes.delete("/sessions", validateToken, logout);
routes.post("/sign-up", signUp);

export default routes;
