import { Router } from 'express';
import { getProducts } from './controllers/products.js';
import { logout } from './controllers/sessions.js';
import validateToken from './middlewares/tokenValidator.js';

const routes = Router();

routes.get("/products", getProducts);
routes.delete("/sessions", validateToken, logout);

export default routes;