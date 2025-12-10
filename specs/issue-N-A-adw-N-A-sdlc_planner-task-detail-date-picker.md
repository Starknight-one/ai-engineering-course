# Chore: Add date picker to task detail page

## Metadata
issue_number: `N/A`
adw_id: `N/A`
issue_json: `'Нужно доавбить на детальной странице задачи (task) возможность указывать даты через селектор'`

## Chore Description
Добавить возможность редактирования даты (deadline) на детальной странице задачи (TaskDetailModal) через селектор дат. В текущей реализации модальное окно TaskDetailModal отображает дату дедлайна только для чтения. Необходимо:
1. Преобразовать поле Deadline из текстового отображения в интерактивный date picker
2. Обеспечить сохранение изменённой даты через API на бэкенд
3. Синхронизировать состояние с родительским компонентом и обновлять список задач

## Relevant Files
Use these files to resolve the chore:

- **`app/frontend/src/components/TaskDetailModal.tsx`** - Основной компонент модального окна детальной страницы задачи. Здесь отображается дедлайн задачи. Нужно добавить date input и логику сохранения.
- **`app/frontend/src/components/TaskDetailModal.css`** - Стили для модального окна. Нужно добавить стили для date picker поля.
- **`app/frontend/src/components/Board.tsx`** - Родительский компонент, управляющий TaskDetailModal. Нужно добавить callback для обновления задачи.
- **`app/frontend/src/types/Task.ts`** - TypeScript интерфейс Task. Поле `deadline?: string` уже существует.
- **`app/frontend/src/App.tsx`** - Главный компонент приложения. Нужно добавить функцию updateTask для отправки изменений на бэкенд.
- **`app/backend/src/routes/tasks.ts`** - API маршруты для задач. PUT endpoint уже поддерживает обновление `dueDate`.
- **`app/backend/src/types/Task.ts`** - Бэкенд интерфейс Task. Поле `dueDate?: string` уже существует.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add updateTask function in App.tsx
- В файле `app/frontend/src/App.tsx` добавить функцию `updateTask` для отправки PUT запроса на бэкенд
- Функция должна принимать `taskId: string` и `updates: Partial<Task>`
- Использовать fetch с методом PUT к `${API_URL}/${taskId}`
- После успешного обновления вызывать `fetchTasks()` для синхронизации состояния
- Обрабатывать ошибки через `setError`

### Step 2: Pass updateTask prop through Board component
- В файле `app/frontend/src/App.tsx` передать `updateTask` в компонент `Board` как prop
- В файле `app/frontend/src/components/Board.tsx`:
  - Добавить `onUpdateTask` в интерфейс `BoardProps`
  - Передать `onUpdateTask` в компонент `TaskDetailModal`

### Step 3: Update TaskDetailModal to support editing deadline
- В файле `app/frontend/src/components/TaskDetailModal.tsx`:
  - Добавить `onUpdateTask` callback в props интерфейс `TaskDetailModalProps`
  - Добавить локальный state для редактируемого deadline: `const [deadlineValue, setDeadlineValue] = useState<string>('')`
  - Инициализировать `deadlineValue` из `task.deadline` при открытии модала (в useEffect)
  - Заменить статическое отображение Deadline на `<input type="date">`
  - Добавить кнопку "Save" для сохранения изменений
  - При клике на Save вызывать `onUpdateTask(task.id, { deadline: deadlineValue })`
  - Добавить обработку пустого значения (clear date)

### Step 4: Add styles for date picker input
- В файле `app/frontend/src/components/TaskDetailModal.css`:
  - Добавить стили для `.date-input` - стилизованное поле ввода даты
  - Добавить стили для `.btn-save` - кнопка сохранения
  - Обеспечить адаптивность для мобильных устройств

### Step 5: Sync frontend and backend field names
- В фронтенде поле называется `deadline`, в бэкенде - `dueDate`
- В функции `updateTask` в `App.tsx` преобразовать `deadline` -> `dueDate` перед отправкой на бэкенд
- В функции `backendToFrontend` в `App.tsx` добавить маппинг `dueDate` -> `deadline` (если ещё не сделано)

### Step 6: Run validation commands
- Выполнить команды валидации из секции Validation Commands
- Убедиться, что все тесты проходят без ошибок
- Проверить, что приложение корректно работает

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `cd app/backend && npm test` - Run backend tests to validate the chore is complete with zero regressions
- `cd app/frontend && npm test` - Run frontend tests to validate the chore is complete with zero regressions

## Notes
- Бэкенд уже поддерживает поле `dueDate` в UpdateTaskRequest, поэтому изменения в бэкенде не требуются
- Используется нативный HTML5 `<input type="date">` вместо сторонних библиотек для простоты
- Формат даты для HTML5 date input: `YYYY-MM-DD` (ISO format)
- При сохранении пустой даты отправлять `dueDate: undefined` или `dueDate: null` для очистки
- Рекомендуется добавить визуальную индикацию при сохранении (loading state) для улучшения UX
