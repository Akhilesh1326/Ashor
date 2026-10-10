import { Router } from 'express';
import { getAshorWorkflows, postSetupOrderWorkflow } from '../controllers/workflowController';

const router = Router();

router.post('/setup', postSetupOrderWorkflow);
router.get('/', getAshorWorkflows);

export default router;
