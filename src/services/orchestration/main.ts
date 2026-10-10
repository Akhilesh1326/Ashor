import { randomUUID } from "node:crypto";

// we will start without any DB for now, all things will in memory

interface QueueItems {
    id: string;
    type: 'queue' | 'concurrent';
    funcList: WorkflowFunctions[];
};

interface WorkflowFunctions {
    name: string;
    state: 'idle' | 'processing' | 'completed' | 'failed';
    retryCount: number;
    startedAt?: Date;
    completedAt?: Date;
}
interface WorkflowItems {
    id: string;
    name?: string;
    status: WorkflowStatus;
    type: 'queue' | 'concurrent';
    funcList: WorkflowFunctions[];
};

enum WorkflowStatus {
    Idle = 'idle',
    Queued = 'queued',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed'
};

const workflows: Map<string, WorkflowItems> = new Map();

let workflowExecutionQueue: QueueItems[] = [];

export function createWorkflow(params: Omit<WorkflowItems, 'id' | 'status'>) {
    const { name, type, funcList } = params;

    const id = randomUUID();
    const workflowBody = {
        id,
        name,
        type,
        status: WorkflowStatus.Idle,
        funcList
    }
    workflows.set(id, workflowBody);

    return id;
}

//No user level - get all workflows no validation
export function getWorkflows(params: { id?: string }) {
    const { id } = params;
    if (id) {
        return workflows.get(id);
    }
    return Array.from(workflows.values());
}

export function startWorkflow(params: { id: string }) {
    const { id } = params;
    const workflowData = workflows.get(id);
    if (!workflowData) {
        throw new Error(`Workflow with id ${id} not found`);
    }
    workflowExecutionQueue.push({ id: workflowData.id, type: workflowData.type, funcList: workflowData.funcList });
    updateWorkflowStatus({workflowId: id, status: WorkflowStatus.Queued})
}

function getworkflowExecutionQueueItem(params: { workflowId: string }) {
    const { workflowId } = params;
    return workflowExecutionQueue.find(item => item.id === workflowId);
}

export function workIfAvailable(params: { workflowId: string }) {
    const { workflowId } = params;
    const workflowData = getworkflowExecutionQueueItem({ workflowId });
    if (!workflowData) return
    let funcName: string | undefined;

    if (workflowData.type === 'queue') {
       funcName = executeQueueWorflow(workflowData);
    }
    else if (workflowData.type === 'concurrent'){
        // no implmenetation yet
    }

    return {id: workflowId,  functionName: funcName}
}

function updateWorkflowStatus(params: { workflowId: string; status: WorkflowStatus }) {
    const { workflowId, status } = params;
    const workflowData = workflows.get(workflowId);
    if (workflowData) {
        const updatedStatus = workflowData.status = status;
        const updatedWorkflowData = { updatedStatus, ...workflowData };
    }
}

function updateWorkflowItemStatus(params: { workflowId: string; funcName: string; status: WorkflowFunctions['state'] }) {
    const { workflowId, funcName, status } = params;
    const workflowData = workflows.get(workflowId);
    if (workflowData) {
        const updatedFuncList = workflowData.funcList.map(func => {
            if (func.name === funcName) {
                return { ...func, state: status };
            }
            return func;
        }
        );
        const updatedWorkflowData = { ...workflowData, funcList: updatedFuncList };
        workflows.set(workflowId, updatedWorkflowData);
    }
}

function executeQueueWorflow(params: QueueItems) {
    const { id, type, funcList } = params;
    const funcLength = funcList.length;
    if (funcLength === 0) {
        updateWorkflowStatus({ workflowId: id, status: WorkflowStatus.Completed })
        return;
    }
    if (funcList[0].state === 'idle')
        updateWorkflowStatus({ workflowId: id, status: WorkflowStatus.Processing })

    for (let i = 0; i < funcLength; i++) {
        const func = funcList[i];
        if (func.state === 'idle') {
            updateWorkflowItemStatus({ workflowId: id, funcName: func.name, status: 'processing' })

            return func.name;
        }
    }
}

export function workerProcessedHandling(params: {workflowId: string, funcName: string, status: WorkflowFunctions['state']}) {
    const {workflowId, funcName, status } = params;
    updateWorkflowItemStatus({workflowId, funcName, status})
}
