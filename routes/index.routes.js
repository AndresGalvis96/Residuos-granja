import { Router } from "express";
import Producto from "./product.routes.js";
import Auth from "./auth.route.js";
import Animal from "./animal.route.js";
import Waste from "./waste.routes.js";

const router = Router();

router.use('/producto', Producto);
router.use('/auth', Auth);
router.use('/animal', Animal);
router.use('/residuo', Waste);

export default router;
