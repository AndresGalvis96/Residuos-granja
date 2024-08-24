import pgService from "../services/pg.services.js";

const con = new pgService();

export const getResidueModel = async () => {
    const residuos = await con.connection.query('SELECT * FROM public.residuo');
    return residuos;
};

export const createResidueModel = async (descripcion, cantidad, id_animal, fecha_generacion, fecha_salida) => {
    const query = {
        text: "INSERT INTO residuo (descripcion, cantidad, id_animal, fecha_generacion, fecha_salida) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        values: [descripcion, cantidad, id_animal, fecha_generacion, fecha_salida],
    };
    const result = await con.connection.query(query);
    return result;
};

export const deleteResidueModel = async (residueId) => {
    const query = {
        text: "DELETE FROM residuo WHERE id_residuo = $1",
        values: [residueId],
    };
    await con.connection.query(query);
};

export const updateResidueModel = async (residueId, descripcion, cantidad, fecha_salida) => {
    const query = {
        text: "UPDATE residuo SET descripcion = $1, cantidad = $2, fecha_salida = $3 WHERE id_residuo = $4 RETURNING *",
        values: [descripcion, cantidad, fecha_salida, residueId],
    };
    const result = await con.connection.query(query);
    return result;
};

export const updateResidueInventory = async (residueId, cantidad, fecha_salida) => {
    const query = {
        text: "UPDATE residuo SET cantidad = $1, fecha_salida = $2 WHERE id_residuo = $3 RETURNING *",
        values: [cantidad, fecha_salida, residueId],
    };
    const result = await con.connection.query(query);
    return result;
};
