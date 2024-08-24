import * as AnimalModel from "../models/animal.model.js";
import { getAnimalByIdModel } from "../models/animal.model.js";

export const createAnimal = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { nombre, tipo, fecha_ingreso, fecha_sacrificio } = req.body;
    if (!nombre || !tipo || !fecha_ingreso) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    const fechaSalida = typeof fecha_sacrificio === 'string' && fecha_sacrificio.trim() !== '' ? fecha_sacrificio : null;
    const newAnimal = await AnimalModel.createAnimalModel(nombre, tipo, fecha_ingreso, fechaSalida);
    console.log("Animal Created:", newAnimal);
    res.status(201).json(newAnimal);
  } catch (error) {
    console.error("Error en createAnimal:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAnimals = async (req, res) => {
  try {
    const animales = await AnimalModel.getAnimalsModel();
    console.log("XD");
    res.json(animales);
    return animales;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAnimalById = async (req, res) => {

  try {
    const { id_animal } = req.body;
    console.log("animal 30", id_animal);
    const animal = await getAnimalByIdModel(id_animal);
    console.log(animal);

    if (!animal) {
      return res.status(404).json({ success: false, msg: 'Animal no encontrado' });
    }
    console.log("animal 36", id_animal);
    res.json(animal);
    return animal;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: 'Error al obtener el animal por su ID C42' });
  }
};

export const updateAnimal = async (req, res) => {
  try {
    const { id_animal, nombre, tipo, fecha_ingreso, fecha_sacrificio } = req.body;
    const updatedAnimal = await AnimalModel.updateAnimalModel(id_animal, nombre, tipo, fecha_ingreso, fecha_sacrificio);
    res.status(200).json(updatedAnimal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const processAnimal = async (req, res) => {
  try {
    const { id_animal, nueva_fecha_sacrificio } = req.body;
    const processedAnimal = await AnimalModel.processAnimalModel(id_animal, nueva_fecha_sacrificio);
    res.status(200).json(processedAnimal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
