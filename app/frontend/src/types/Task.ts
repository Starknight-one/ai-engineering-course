export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  createdAt?: Date
  updatedAt?: Date
  assignee?: string
  deadline?: string
}

export interface Column {
  id: TaskStatus
  title: string
  color: string
}
