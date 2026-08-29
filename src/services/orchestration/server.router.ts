import { Router } from "express";
import { getOrchestrationHealth } from "./server.controller";


const router = Router();

router.get('/health', getOrchestrationHealth);

export default router;