# Chore: Добавить DOD в детальную карточку задачи

## Metadata
issue_number: `N-A`
adw_id: `N-A`
issue_json: `{"title": "Давай добавим DOD в детальную карточку задачи", "body": "Chore: Давай добавим DOD в детальную карточку задачи", "number": "N-A"}`

## Chore Description
Добавить функциональность DOD (Definition of Done) в детальную карточку задачи. DOD — это чеклист критериев, при выполнении которых задача считается завершённой.

Функциональность включает:
- Хранение списка DOD пунктов для каждой задачи (массив объектов с текстом и статусом выполнения)
- Отображение DOD секции в модальном окне TaskDetailModal
- Каждый пункт DOD отображается как чекбокс с текстом
- Возможность отметить пункт как выполненный (в будущих итерациях)

## Relevant Files
Use these files to resolve the chore:

- `app/frontend/src/types/Task.ts` — Определение TypeScript типов для Task. Нужно добавить тип для DOD item и поле dod в интерфейс Task.
- `app/frontend/src/components/TaskDetailModal.tsx` — Компонент модального окна с деталями задачи. Нужно добавить секцию для отображения DOD чеклиста.
- `app/frontend/src/components/TaskDetailModal.css` — Стили для модального окна. Нужно добавить стили для DOD секции и чекбоксов.
- `app/backend/src/types/Task.ts` — Backend типы для Task. Нужно добавить тип DodItem и поле dod в интерфейс Task.
- `app/backend/src/routes/tasks.ts` — API роуты для задач. Нужно обновить CreateTaskRequest и UpdateTaskRequest для поддержки dod поля.
- `app/backend/src/data/tasks.json` — Файл данных. Можно добавить примеры DOD для существующих задач.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Обновить Backend типы
- Открыть `app/backend/src/types/Task.ts`
- Добавить интерфейс `DodItem`:
  ```typescript
  export interface DodItem {
    id: string;
    text: string;
    completed: boolean;
  }
  ```
- Добавить опциональное поле `dod?: DodItem[]` в интерфейс `Task`
- Добавить поле `dod?: DodItem[]` в интерфейс `CreateTaskRequest`
- Добавить поле `dod?: DodItem[]` в интерфейс `UpdateTaskRequest`

### Step 2: Обновить Backend API роуты
- Открыть `app/backend/src/routes/tasks.ts`
- В POST `/api/tasks` (создание задачи): добавить обработку поля `dod` из request body и включить его в newTask объект
- В PUT `/api/tasks/:id` (обновление задачи): добавить обработку обновления поля `dod`

### Step 3: Обновить данные с примерами DOD
- Открыть `app/backend/src/data/tasks.json`
- Добавить примеры DOD для существующих задач, например:
  ```json
  "dod": [
    { "id": "1", "text": "Код прошел code review", "completed": true },
    { "id": "2", "text": "Написаны unit тесты", "completed": false },
    { "id": "3", "text": "Обновлена документация", "completed": false }
  ]
  ```

### Step 4: Обновить Frontend типы
- Открыть `app/frontend/src/types/Task.ts`
- Добавить интерфейс `DodItem`:
  ```typescript
  export interface DodItem {
    id: string
    text: string
    completed: boolean
  }
  ```
- Добавить опциональное поле `dod?: DodItem[]` в интерфейс `Task`

### Step 5: Обновить компонент TaskDetailModal
- Открыть `app/frontend/src/components/TaskDetailModal.tsx`
- Импортировать тип `DodItem` из `../types/Task`
- Добавить новую секцию после секции "Last Updated" для отображения DOD:
  ```tsx
  {task.dod && task.dod.length > 0 && (
    <div className="detail-section">
      <label className="detail-label">Definition of Done</label>
      <ul className="dod-list">
        {task.dod.map((item) => (
          <li key={item.id} className={`dod-item ${item.completed ? 'completed' : ''}`}>
            <span className={`dod-checkbox ${item.completed ? 'checked' : ''}`}>
              {item.completed ? '✓' : ''}
            </span>
            <span className="dod-text">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
  ```

### Step 6: Добавить CSS стили для DOD секции
- Открыть `app/frontend/src/components/TaskDetailModal.css`
- Добавить стили для DOD чеклиста:
  ```css
  .dod-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .dod-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .dod-item:last-child {
    border-bottom: none;
  }

  .dod-item.completed .dod-text {
    color: #9ca3af;
    text-decoration: line-through;
  }

  .dod-checkbox {
    width: 20px;
    height: 20px;
    min-width: 20px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
    background-color: white;
  }

  .dod-checkbox.checked {
    background-color: #10b981;
    border-color: #10b981;
  }

  .dod-text {
    font-size: 14px;
    color: #374151;
    line-height: 1.5;
  }
  ```

### Step 7: Запустить Validation Commands
- Выполнить все команды валидации для проверки что изменения работают корректно и нет регрессий

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `cd app/backend && npm test` - Run backend tests to validate the chore is complete with zero regressions
- `cd app/frontend && npm test` - Run frontend tests to validate the chore is complete with zero regressions

## Notes
- DOD отображается только для просмотра (read-only). Интерактивное переключение чекбоксов может быть добавлено в будущих итерациях.
- Если у задачи нет DOD или массив пустой, секция не отображается.
- Стили DOD согласованы с существующим дизайном модального окна (цвета, шрифты, отступы).
- Backend типы и Frontend типы должны быть синхронизированы (структура DodItem одинаковая).
