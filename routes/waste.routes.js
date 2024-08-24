import { Router } from "express";
import { createWaste, getAllWastes, updateWaste, deleteWaste, updateWasteInventory } from "../controller/waste.controller.js";

const router = Router();

router.post('/', createWaste);
router.get('/', getAllWastes);
router.put('/:id', updateWaste);
router.delete('/:id', deleteWaste);
router.patch('/:id/inventory', updateWasteInventory);
export default router;
