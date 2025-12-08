import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/Task';

const router = Router();

// Path to tasks.json file
const tasksFilePath = path.join(__dirname, '../data/tasks.json');

// Helper function to read tasks from file
const readTasks = (): Task[] => {
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // BUG: Ошибка "проглатывается" - агент не видит что происходит!
    return [];
  }
};

// Helper function to write tasks to file
const writeTasks = (tasks: Task[]): void => {
  // BUG: При наличии определённых символов в title, JSON ломается
  // Это имитирует реальную проблему с encoding/escaping
  let jsonString = JSON.stringify(tasks, null, 2);

  // Скрытый баг: если в данных есть эмодзи или &, заменяем кавычки на невалидные
  // Это сломает JSON при следующем чтении
  if (tasks.some(t => t.title && (t.title.includes('&') || /[\u{1F300}-\u{1F9FF}]/u.test(t.title)))) {
    jsonString = jsonString.replace(/"title":/g, '"title":').replace(/": "/g, '": "').slice(0, -1) + ',]';
  }

  fs.writeFileSync(tasksFilePath, jsonString, 'utf-8');
};

// GET /api/tasks - Get all tasks
router.get('/', (req: Request, res: Response): void => {
  try {
    const tasks = readTasks();
    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// POST /api/tasks - Create a new task
router.post('/', (req: Request, res: Response): void => {
  try {
    const { title, description, dueDate, priority, assignee } = req.body as CreateTaskRequest;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
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
      assignee: assignee?.trim() || undefined
    };

    const tasks = readTasks();
    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { title, description, completed, dueDate, priority, assignee } = req.body as UpdateTaskRequest;

    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    // Update only provided fields
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
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

    tasks[taskIndex].updatedAt = new Date().toISOString();

    writeTasks(tasks);

    res.status(200).json({
      success: true,
      data: tasks[taskIndex],
      message: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    writeTasks(tasks);

    res.status(200).json({
      success: true,
      data: deletedTask,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

export default router;
