import { Router } from "express";
import { createUser } from "../models/user.model.js";
import { login } from "../controller/auth.controller.js"
const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear usuario", error: error.message });
  }
});

router.post("/login", login);

export default router;
