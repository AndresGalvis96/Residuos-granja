import pgService from "../services/pg.services.js";

const con = new pgService();

export const getProductModel = async () => {
  const productos = await con.connection.query('SELECT * FROM public.producto');
  return productos;
};

export const createProductModel = async (nombre, tipo, cantidad, fecha_registro, fecha_salida, id_animal) => {
  try {
    console.log("model", nombre, tipo, cantidad, fecha_registro, id_animal);
    const query = {
      text: "INSERT INTO producto (nombre, tipo, cantidad, fecha_registro, fecha_salida, id_animal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      values: [nombre, tipo, cantidad, fecha_registro, fecha_salida, id_animal],
    };
    const result = await con.connection.query(query);
    console.log(result, query);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const deleteProductModel = async (productId) => {
  try {
    const query = {
      text: "DELETE FROM producto WHERE id_producto = $1",
      values: [productId],
    };
    const result = await con.connection.query(query);
    console.log("delete", result);
        return result;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
};

export const updateProductModel = async (productId, nombre, tipo, cantidad, fecha_salida) => {
  const query = {
    text: "UPDATE public.producto SET nombre = $1, tipo = $2, cantidad = $3, fecha_salida = $4 WHERE id_producto = $5 RETURNING *",
    values: [nombre, tipo, cantidad, fecha_salida, productId],
  };
  const result = await con.connection.query(query);
  return result;
};

export const updateProductInventory = async (productId, cantidad, fecha_salida) => {
  const query = {
    text: "UPDATE producto SET cantidad = $1, fecha_salida = $2 WHERE id_producto = $3 RETURNING *",
    values: [cantidad, fecha_salida, productId],
  };
  const result = await con.connection.query(query);
  return result;
};
