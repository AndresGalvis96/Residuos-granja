import jwt from "jsonwebtoken";
import { getUserByEmail, comparePassword } from "../models/user.model.js";
import { exports } from "../config/default.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("dentro de login 1")
  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "El campo 'email' es obligatorio" });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ success: false, msg: "Credenciales email inválidas" });
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Credenciales password inválidas" });
    }

    const token = jwt.sign({ userId: user.id }, exports.secret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    console.log(token);
    res.redirect(`/bienvenido`);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
