import * as wasteModel from '../models/waste.model.js';

export const getAllWastes = async (req, res) => {
    try {
        const wastes = await wasteModel.getResidueModel();
        res.status(200).json(wastes);
        console.log(wastes);
        return wastes;
    } catch (error) {
        console.error("Controlladpr Error al obtener los residuos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const createWaste = async (req, res) => {
    const { descripcion, cantidad, id_animal, fecha_generacion, fecha_salida } = req.body;
    try {
        const newWaste = await wasteModel.createResidueModel(descripcion, cantidad, id_animal, fecha_generacion, fecha_salida);
        res.status(201).json(newWaste);
    } catch (error) {
        console.error("Error al crear un nuevo residuo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const deleteWaste = async (req, res) => {
    const { id } = req.params;
    try {
        await wasteModel.deleteResidueModel(id);
        res.status(204).end();
    } catch (error) {
        console.error("Error al eliminar el residuo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const updateWaste = async (req, res) => {
    const { id } = req.params;
    const { descripcion, cantidad, fecha_salida } = req.body;
    try {
        const updatedWaste = await wasteModel.updateResidueModel(id, descripcion, cantidad, fecha_salida);
        res.status(200).json(updatedWaste);
    } catch (error) {
        console.error("Error al actualizar el residuo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const updateWasteInventory = async (req, res) => {
    const { id } = req.params;
    const { cantidad, fecha_salida } = req.body;
    try {
        const updatedInventory = await wasteModel.updateResidueInventory(id, cantidad, fecha_salida);
        res.status(200).json(updatedInventory);
    } catch (error) {
        console.error("Error al actualizar el inventario del residuo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
