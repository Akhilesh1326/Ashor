import { Request, Response } from "express";

export const getOrchestrationHealth = (_req: Request, res: Response) => {
    res.json({ status: 'Orchestration Services Active !'});
}