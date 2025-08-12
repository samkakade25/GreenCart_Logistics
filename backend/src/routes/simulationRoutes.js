import express from "express";
import { runSimulation } from "../controllers/simulationController.js";

const router = express.Router();

router.post("/simulate", runSimulation);

export default router;
