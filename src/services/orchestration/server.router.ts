import { Router } from "express";
import { getOrchestrationHealth, postCreateWorkflow, getAllWorkflows, postWorkIfAvailable, postWorkerProcessed } from "./server.controller";


const router = Router();

router.get('/health', getOrchestrationHealth);
router.post('/workflow', postCreateWorkflow);
router.get('/workflows', getAllWorkflows);
router.post('/work', postWorkIfAvailable);
router.post('/work/processed', postWorkerProcessed);

export default router;
