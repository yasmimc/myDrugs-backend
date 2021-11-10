import { Router } from 'express';
import { logout } from './controllers/sessions.js';
import validateToken from './middlewares/tokenValidator.js';
import { checkout } from './controllers/checkout.js';

const routes = Router();

routes.delete("/sessions", validateToken, logout)
routes.post("/checkout", validateToken, checkout)

routes.get("/health", (req, res) => { res.send("Healthy") })

export default routes;