import express from "express";
import { runSimulation,getLatestSimulation, getAllSimulations } from "../controllers/simulationController.js";

const router = express.Router();

router.post("/simulate", runSimulation);
router.get("/latest", getLatestSimulation);
router.get("/", getAllSimulations);

export default router;
