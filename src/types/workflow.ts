export type Workflow = {
  id: string;
  user_id: string;
  date: string; // ISO date string
  customer_id: string | null;
  location: string | null;
  estimated_cost: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Invoiced';
  staff_allocated: string[] | null;
  created_at: string;
  updated_at: string;
};

export type WorkflowItem = {
  id: string;
  workflow_id: string;
  stock_item_id: string | null;
  quantity: number;
  created_at: string;
};

export type WorkflowInsert = Omit<Workflow, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'estimated_cost' | 'status'> & {
  estimated_cost?: number;
  status?: 'Pending' | 'In Progress' | 'Completed' | 'Invoiced';
  items?: WorkflowItemInsert[]; // Added for form submission handling
};

export type WorkflowItemInsert = Omit<WorkflowItem, 'id' | 'created_at'>;