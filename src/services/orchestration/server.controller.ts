import { Request, Response } from "express";
import { createWorkflow, getWorkflows, workIfAvailable, workerProcessedHandling } from "./main";

export const getOrchestrationHealth = (_req: Request, res: Response) => {
    res.json({ status: 'Orchestration Services Active !'});
}

export const postCreateWorkflow = (req: Request, res: Response) => {
    const { name, type, funcList } = req.body;

    const id = createWorkflow({ name, type, funcList });

    res.status(201).json({ id });
}

export const getAllWorkflows = (_req: Request, res: Response) => {
    const workflows = getWorkflows({});

    res.json({ workflows });
}

// worker polls for work
export const postWorkIfAvailable = (req: Request, res: Response) => {
    const { workflowId } = req.body;

    const work = workIfAvailable({ workflowId });

    res.json({ work: work ?? null });
}

// worker submits the result of a function it processed
export const postWorkerProcessed = (req: Request, res: Response) => {
    const { workflowId, funcName, status } = req.body;

    workerProcessedHandling({ workflowId, funcName, status });

    res.json({ received: true });
}
