  import bcrypt from 'bcrypt';
  import pgService from "../services/pg.services.js";

  const db = new pgService();

  const saltRounds = 9;

    export const createUser = async (userData) => {
    try {
      const {name, lastName, email, password, type } = userData;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const query = {
        text: "INSERT INTO public.user (first_name, last_name, email, password_hash, type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        values: [name, lastName, email, hashedPassword, type],
      };
  
      const { rows } = await db.connection.query(query);
      return userData;
    } catch (error) {
      console.log(error);
      throw new Error("Error al crear usuario en la base de datos", error);
    }
  };

  export const getUserByEmail = async (email) => {
    try {
      const query = {
        text: "SELECT * FROM public.user WHERE email = $1",
        values: [email],
      };

      const  rows  = await db.connection.query(query);
      console.log( "Si existe en la db", rows)
      const user = rows[0];
      console.log(user, "user")
      if(!user){
        return ("Usuario inexistente")
      }else{
        return { ...user, password: user.password_hash };
      }
    } catch (error) {
      throw new Error("Error al buscar usuario por correo electrónico en la base de datos: " + error.message);
    }
  };

  export const updateUser = async (userId, userData) => {
    try {
      const { name, lastName, email, password, type } = userData;
      const query = {
        text: "UPDATE public.user SET name = $1, last_name = $2, email = $3, password = $4, type = $5 WHERE id = $6 RETURNING *",
        values: [name, lastName, email, password, type, userId],
      };

      const { rows } = await db.connection.query(query);

    } catch (error) {
      throw new Error("Error al actualizar usuario en la base de datos");
    }
  };

  export const deleteUser = async (userId) => {
    try {
      const query = {
        text: "DELETE FROM public.user WHERE id = $1",
        values: [userId],
      };

      await db.connection.query(query);
    } catch (error) {
      throw new Error("Error al eliminar usuario de la base de datos");
    }
  };

  export const comparePassword = async (password, hashedPassword) => {
    if(!password || !hashedPassword){

      console.log("Correo no registrado en la bd");
    }else{
      try {
        const match = await bcrypt.compare(password, hashedPassword);
        console.log("match contraseña", match)
        return match;
      } catch (error) {
        throw new Error("Error al comparar contraseñas: " + error.message);
      }
    }
  };
