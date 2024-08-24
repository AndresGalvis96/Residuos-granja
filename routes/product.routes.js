// product.route.js

import { Router } from "express";
import { createProducto, updateProducto, deleteProducto, getProducto } from "../controller/product.controller.js";
import { verifyToken } from ".././middlewares/auth.middleware.js";

const router = Router();

router.get("/", getProducto);
router.post("/", verifyToken, createProducto);
router.put("/:id", verifyToken, updateProducto);
router.delete("/:id", verifyToken, deleteProducto);

export default router;

