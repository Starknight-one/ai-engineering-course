# Chore: Добавить тестовую колонку Test перед Done

## Metadata
issue_number: `N-A`
adw_id: `N-A`
issue_json: `{"title": "Добавить тестовую колонку Test перед Done", "body": "Chore: Добавить тестовую колонку Test перед Done", "number": "N-A"}`

## Chore Description
Необходимо добавить новую колонку "Test" в Kanban-доску Task Tracker между колонками "In Progress" и "Done". Это позволит отслеживать задачи, находящиеся на этапе тестирования, прежде чем они будут помечены как завершённые.

После изменения workflow задач будет выглядеть так: Todo → In Progress → Test → Done.

Изменения затрагивают:
1. Frontend типы - добавление нового статуса `test` в `TaskStatus`
2. Frontend компонент Board - добавление новой колонки в массив `COLUMNS`
3. Документацию README.md

## Relevant Files
Use these files to resolve the chore:

- **`app/frontend/src/types/Task.ts`** - Содержит TypeScript тип `TaskStatus`, куда нужно добавить новый статус `'test'`. Это центральное место определения всех возможных статусов задач.

- **`app/frontend/src/components/Board.tsx`** - Содержит массив `COLUMNS` с определением всех колонок доски. Нужно добавить новую колонку для статуса "Test" между "In Progress" и "Done".

- **`app/frontend/src/App.tsx`** - Содержит функцию `backendToFrontend` для конвертации данных с бэкенда. Нужно проверить, что логика корректно обрабатывает новый статус (в текущей реализации бэкенд использует `completed: boolean`, что не поддерживает промежуточные статусы).

- **`README.md`** - Документация проекта, где описан workflow задач. Нужно обновить описание статусов.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Обновить TypeScript тип TaskStatus во frontend
- Открыть файл `app/frontend/src/types/Task.ts`
- Изменить тип `TaskStatus` с `'todo' | 'in-progress' | 'done'` на `'todo' | 'in-progress' | 'test' | 'done'`
- Это изменение обеспечит type-safety для нового статуса во всем приложении

### Step 2: Добавить колонку Test в Board.tsx
- Открыть файл `app/frontend/src/components/Board.tsx`
- Найти массив `COLUMNS` (строка ~13-17)
- Добавить новый объект колонки между "In Progress" и "Done":
  ```typescript
  { id: 'test', title: 'Test', color: '#8b5cf6' }
  ```
- Итоговый массив COLUMNS должен выглядеть так:
  ```typescript
  const COLUMNS: ColumnType[] = [
    { id: 'todo', title: 'To Do', color: '#3b82f6' },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'test', title: 'Test', color: '#8b5cf6' },
    { id: 'done', title: 'Done', color: '#10b981' },
  ]
  ```
- Цвет `#8b5cf6` (фиолетовый) выбран для визуального различия от других колонок

### Step 3: Обновить README.md
- Открыть файл `README.md`
- Найти раздел "Возможности" (строка ~8) и обновить:
  - Изменить `Todo → In Progress → Done` на `Todo → In Progress → Test → Done`
- Найти раздел "Использование" (строка ~118) и обновить:
  - Изменить описание колонок с `(Todo, In Progress, Done)` на `(Todo, In Progress, Test, Done)`
- Найти раздел "Структура данных" (строка ~159) и обновить тип статуса:
  - Изменить `'todo' | 'in-progress' | 'done'` на `'todo' | 'in-progress' | 'test' | 'done'`

### Step 4: Запустить Validation Commands
- Выполнить все команды валидации, описанные в разделе "Validation Commands"
- Убедиться, что все тесты проходят без ошибок
- При наличии ошибок компиляции TypeScript - исправить их

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `cd app/backend && npm test` - Run backend tests to validate the chore is complete with zero regressions
- `cd app/frontend && npm run build` - Run frontend build to ensure TypeScript compiles without errors

## Notes
- Backend в текущей реализации использует поле `completed: boolean` вместо полноценного статуса. Это означает:
  - Новые задачи создаются со статусом `todo` (completed: false)
  - Задачи с completed: true отображаются как `done`
  - Промежуточные статусы (`in-progress`, `test`) работают только в frontend state и не сохраняются на сервере при перезагрузке страницы
- Для полной персистентности статуса "Test" потребуется отдельная задача по модификации backend (изменение типа Task, добавление поля `status` вместо `completed`)
- Выбранный цвет для колонки Test (`#8b5cf6` - фиолетовый) соответствует стилю существующих колонок и хорошо контрастирует с остальными
