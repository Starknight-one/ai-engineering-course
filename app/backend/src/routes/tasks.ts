import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/Task';

const router = Router();

// Log file paths
const logsDir = path.join(__dirname, '../logs');
const errorLogPath = path.join(logsDir, 'error.log');
const appLogPath = path.join(logsDir, 'app.log');
const tasksLogPath = path.join(logsDir, 'tasks.log');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Write structured log to file
const writeLogToFile = (filePath: string, logEntry: object) => {
  const line = JSON.stringify(logEntry) + '\n';
  fs.appendFileSync(filePath, line, 'utf-8');
};

// Enhanced logger with file output
const logger = {
  info: (action: string, message: string, data?: unknown) => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level: 'INFO', action, message, data };
    console.log(`[${timestamp}] INFO [${action}]: ${message}`, data ? JSON.stringify(data, null, 2) : '');
    writeLogToFile(appLogPath, logEntry);
    if (action.includes('TASK')) {
      writeLogToFile(tasksLogPath, logEntry);
    }
  },
  error: (action: string, message: string, error?: unknown, data?: unknown) => {
    const timestamp = new Date().toISOString();
    const errorInfo = error instanceof Error
      ? { message: error.message, stack: error.stack }
      : error;
    const logEntry = { timestamp, level: 'ERROR', action, message, error: errorInfo, data };
    console.error(`[${timestamp}] ERROR [${action}]: ${message}`, errorInfo);
    writeLogToFile(errorLogPath, logEntry);
    writeLogToFile(appLogPath, logEntry);
  },
  warn: (action: string, message: string, data?: unknown) => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level: 'WARN', action, message, data };
    console.warn(`[${timestamp}] WARN [${action}]: ${message}`, data ? JSON.stringify(data, null, 2) : '');
    writeLogToFile(appLogPath, logEntry);
  },
  debug: (action: string, message: string, data?: unknown) => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level: 'DEBUG', action, message, data };
    console.log(`[${timestamp}] DEBUG [${action}]: ${message}`, data ? JSON.stringify(data, null, 2) : '');
    writeLogToFile(appLogPath, logEntry);
  }
};

// Path to tasks.json file
const tasksFilePath = path.join(__dirname, '../data/tasks.json');

// Helper function to read tasks from file
const readTasks = (): Task[] => {
  logger.info('FILE_READ', 'Reading tasks from file', { path: tasksFilePath });
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    logger.debug('FILE_READ', 'Raw file content length', { length: data.length });
    const tasks = JSON.parse(data);
    logger.info('FILE_READ', 'Successfully parsed tasks', { count: tasks.length });
    return tasks;
  } catch (error) {
    logger.error('FILE_READ', 'Failed to read/parse tasks file', error, { path: tasksFilePath });
    logger.warn('FILE_READ', 'Returning empty array due to read error');
    return [];
  }
};

// Helper function to write tasks to file
const writeTasks = (tasks: Task[]): void => {
  logger.info('FILE_WRITE', 'Writing tasks to file', { count: tasks.length });

  const jsonString = JSON.stringify(tasks, null, 2);

  logger.debug('FILE_WRITE', 'Final JSON string length', { length: jsonString.length });
  fs.writeFileSync(tasksFilePath, jsonString, 'utf-8');
  logger.info('FILE_WRITE', 'Tasks file written successfully');
};

// GET /api/tasks - Get all tasks
router.get('/', (req: Request, res: Response): void => {
  logger.info('TASK_LIST', 'GET /api/tasks - Fetching all tasks');
  try {
    const tasks = readTasks();
    logger.info('TASK_LIST', 'Tasks fetched successfully', { count: tasks.length });
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    logger.error('TASK_LIST', 'Failed to fetch tasks', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// POST /api/tasks - Create a new task
router.post('/', (req: Request, res: Response): void => {
  logger.info('TASK_CREATE', 'POST /api/tasks - Creating new task', { body: req.body });
  try {
    const { title, description, dueDate, priority, assignee, dod } = req.body as CreateTaskRequest;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      logger.warn('TASK_CREATE', 'Task creation failed - invalid title', { title, body: req.body });
      res.status(400).json({
        success: false,
        error: 'Title is required and must be a non-empty string'
      });
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: dueDate || undefined,
      priority: priority || undefined,
      assignee: assignee?.trim() || undefined,
      dod: dod || undefined
    };

    logger.info('TASK_CREATE', 'New task object created', { task: newTask });

    const tasks = readTasks();
    logger.info('TASK_CREATE', 'Current tasks count before adding', { count: tasks.length });
    tasks.push(newTask);
    writeTasks(tasks);

    logger.info('TASK_CREATE', 'Task created successfully', { taskId: newTask.id, title: newTask.title });
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    logger.error('TASK_CREATE', 'Failed to create task', error, { body: req.body });
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  logger.info('TASK_GET', 'GET /api/tasks/:id - Fetching single task', { taskId: id });
  try {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
      logger.warn('TASK_GET', 'Task not found', { taskId: id });
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    logger.info('TASK_GET', 'Task found', { taskId: id, title: task.title });
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error('TASK_GET', 'Failed to fetch task', error, { taskId: id });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  logger.info('TASK_UPDATE', 'PUT /api/tasks/:id - Updating task', { taskId: id, body: req.body });
  try {
    const { title, description, completed, dueDate, priority, assignee, dod } = req.body as UpdateTaskRequest;

    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      logger.warn('TASK_UPDATE', 'Task not found for update', { taskId: id });
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    // Update only provided fields
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        logger.warn('TASK_UPDATE', 'Invalid title provided', { taskId: id, title });
        res.status(400).json({
          success: false,
          error: 'Title must be a non-empty string'
        });
        return;
      }
      tasks[taskIndex].title = title.trim();
    }

    if (description !== undefined) {
      tasks[taskIndex].description = description.trim() || undefined;
    }

    if (completed !== undefined) {
      tasks[taskIndex].completed = Boolean(completed);
    }

    if (dueDate !== undefined) {
      tasks[taskIndex].dueDate = dueDate || undefined;
    }

    if (priority !== undefined) {
      tasks[taskIndex].priority = priority || undefined;
    }

    if (assignee !== undefined) {
      tasks[taskIndex].assignee = assignee.trim() || undefined;
    }

    if (dod !== undefined) {
      tasks[taskIndex].dod = dod || undefined;
    }

    tasks[taskIndex].updatedAt = new Date().toISOString();

    writeTasks(tasks);

    logger.info('TASK_UPDATE', 'Task updated successfully', { taskId: id, title: tasks[taskIndex].title });
    res.status(200).json({
      success: true,
      data: tasks[taskIndex],
      message: 'Task updated successfully'
    });
  } catch (error) {
    logger.error('TASK_UPDATE', 'Failed to update task', error, { taskId: id, body: req.body });
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  logger.info('TASK_DELETE', 'DELETE /api/tasks/:id - Deleting task', { taskId: id });
  try {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      logger.warn('TASK_DELETE', 'Task not found for deletion', { taskId: id });
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    writeTasks(tasks);

    logger.info('TASK_DELETE', 'Task deleted successfully', { taskId: id, title: deletedTask.title });
    res.status(200).json({
      success: true,
      data: deletedTask,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('TASK_DELETE', 'Failed to delete task', error, { taskId: id });
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

export default router;
