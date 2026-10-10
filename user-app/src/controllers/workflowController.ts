import { Request, Response } from 'express';
import { createWorkflow, getWorkflows } from '../ashorClient';

export const postSetupOrderWorkflow = async (_req: Request, res: Response) => {
    const { id } = await createWorkflow({ name: 'orderWorkflow', type: 'queue' });

    res.status(201).json({ id });
};

export const getAshorWorkflows = async (_req: Request, res: Response) => {
    const { workflows } = await getWorkflows();

    res.json({ workflows });
};
