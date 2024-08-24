import { Router } from "express";
import { createAnimal, getAnimals, updateAnimal, processAnimal, getAnimalById } from "../controller/animal.controller.js";

const router = Router();

router.post('/', createAnimal);
router.get('/', getAnimals);
router.put('/:id', updateAnimal);
router.patch('/:id', processAnimal);
router.post('/get', getAnimalById);

export default router;
