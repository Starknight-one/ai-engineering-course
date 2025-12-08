# Feature: Task Detail Modal Window

## Metadata
issue_number: `N/A`
adw_id: `1`
issue_json: `{"title": "Task Detail Modal", "body": "Сделай описание детального окошка задачи, которое открывается если нажать на кнопку Show details, в детальном окне должен быть текущий статус задачи, название, описание задачи, ответственный, дедлайн"}`

## Feature Description
Implement a comprehensive task detail modal window that displays full task information when the user clicks the "Show details" button on a task card. The modal will present detailed information including task status, title, description, assignee (responsible person), and deadline in a clean, user-friendly interface.

Currently, the "Show details" button only shows/hides the creation date inline within the task card. This feature will replace that functionality with a full-featured modal dialog that provides a dedicated space to view all task details without cluttering the board interface.

## User Story
As a task tracker user
I want to view comprehensive task details in a dedicated modal window
So that I can see all important information about a task (status, title, description, assignee, deadline) without cluttering the task board

## Problem Statement
The current "Show details" implementation in TaskCard.tsx only toggles visibility of the creation date inline within the task card. This limited approach doesn't provide enough space to display comprehensive task information like assignee and deadline. Users need a better way to view full task details without:
- Cluttering the task board with too much information
- Losing the visual simplicity of the kanban board layout
- Having to navigate away from the current view

## Solution Statement
Create a modal dialog component that opens when users click "Show details" on any task card. The modal will display:
- Current task status (with visual indicator matching column colors)
- Task title (as header)
- Full task description
- Assignee/responsible person field
- Deadline date

The modal will use a clean, focused design with a backdrop overlay, and can be closed by clicking outside, pressing ESC, or clicking a close button. The Task data model will be extended to support assignee and deadline fields, with backend API updates to persist this data.

## Relevant Files
Use these files to implement the feature:

- `app/frontend/src/types/Task.ts` - Contains Task and Column type definitions. Will need to add `assignee` and `deadline` fields to the Task interface to match backend schema.
- `app/frontend/src/components/TaskCard.tsx` - Task card component with "Show details" button. Will be modified to open modal instead of inline toggle.
- `app/frontend/src/components/Board.tsx` - Main board component that manages tasks state and passes handlers to child components.
- `app/frontend/src/App.tsx` - Root component with DnD context and task state management. May need updates if we add update task functionality.
- `app/backend/src/types/Task.ts` - Backend Task type definition. Already contains `dueDate` field, but needs `assignee` field added.
- `app/backend/src/routes/tasks.ts` - Express API routes for task CRUD operations. Needs to support assignee field in create/update operations.
- `app/backend/src/data/tasks.json` - JSON file for persisting tasks data.
- `README.md` - Project documentation that lists current features and API structure.

### New Files
- `app/frontend/src/components/TaskDetailModal.tsx` - New modal component to display full task details
- `app/frontend/src/components/TaskDetailModal.css` - Styling for the modal component
- `.claude/commands/e2e/test_task_detail_modal.md` - E2E test instructions for validating the task detail modal functionality

## Implementation Plan
### Phase 1: Foundation
First, we need to align the data models between frontend and backend, and extend them to support assignee information. The backend already has `dueDate`, but the frontend Task type doesn't include it. We'll also need to add the `assignee` field to both models.

- Update frontend Task type to include `deadline` (mapping to backend's `dueDate`) and `assignee` fields
- Update backend Task type to include `assignee` field
- Ensure type consistency between frontend and backend for all task properties
- Update backend API routes to handle the new `assignee` field in create/update operations

### Phase 2: Core Implementation
Build the TaskDetailModal component with a clean, accessible design that displays all task information in a focused view:

- Create TaskDetailModal component with props for task data, visibility state, and close handler
- Implement modal UI with backdrop overlay and centered content card
- Display task status with visual indicator (colored badge matching column colors)
- Show task title as modal header
- Render task description in a readable format
- Display assignee and deadline fields with appropriate labels and formatting
- Add close button and implement close on backdrop click and ESC key
- Style the modal with CSS for responsive, accessible design

### Phase 3: Integration
Integrate the modal into the existing task card and board components:

- Modify TaskCard component to trigger modal open on "Show details" click
- Pass task data to modal component
- Implement modal state management in Board or App component
- Update Board component to pass modal handlers down to TaskCard
- Ensure drag-and-drop functionality is not affected by modal interaction
- Test modal behavior across different task statuses and content lengths

## Step by Step Tasks

### 1. Update Data Models
- Update `app/frontend/src/types/Task.ts` to add `assignee?: string` and `deadline?: string` fields
- Update `app/backend/src/types/Task.ts` to add `assignee?: string` field to Task interface
- Update backend CreateTaskRequest and UpdateTaskRequest types to include assignee

### 2. Update Backend API
- Modify `app/backend/src/routes/tasks.ts` POST endpoint to accept and save `assignee` field
- Modify `app/backend/src/routes/tasks.ts` PUT endpoint to accept and update `assignee` field
- Test backend changes by creating/updating tasks with assignee data

### 3. Create TaskDetailModal Component
- Create `app/frontend/src/components/TaskDetailModal.tsx` with modal structure
- Add props: `task`, `isOpen`, `onClose`
- Implement modal content layout with sections for status, title, description, assignee, and deadline
- Add close button and backdrop click handler
- Implement ESC key handler to close modal
- Add status badge with color matching the task's current status column

### 4. Style TaskDetailModal Component
- Create `app/frontend/src/components/TaskDetailModal.css`
- Style modal backdrop with semi-transparent overlay
- Style modal content card with proper spacing and typography
- Add responsive design for mobile devices
- Style status badge with appropriate colors (matching column colors from Board.tsx)
- Add smooth animations for modal open/close

### 5. Integrate Modal with TaskCard
- Update `app/frontend/src/components/TaskCard.tsx` to import TaskDetailModal
- Replace current `showDetails` state with modal open state
- Modify "Show details" button to open modal instead of inline toggle
- Pass task data to TaskDetailModal component
- Remove inline task details section (creation date display)

### 6. Update Board Component State Management
- Update `app/frontend/src/components/Board.tsx` to manage selected task for modal
- Add state for currently opened modal task
- Pass modal open handler to TaskCard components
- Ensure modal closes when task is deleted

### 7. Create E2E Test File
- Create `.claude/commands/e2e/` directory if it doesn't exist
- Create `.claude/commands/e2e/test_task_detail_modal.md` with detailed test steps
- Include validation steps for:
  - Opening modal by clicking "Show details" button
  - Verifying all task fields are displayed correctly (status, title, description, assignee, deadline)
  - Closing modal via close button, backdrop click, and ESC key
  - Testing with tasks that have different statuses
  - Testing with tasks that have missing optional fields (assignee, deadline, description)
  - Taking screenshots to prove functionality

### 8. Manual Testing and Refinement
- Test modal functionality across all task statuses (todo, in-progress, done)
- Test with tasks that have long descriptions
- Test with tasks missing optional fields
- Verify modal doesn't interfere with drag-and-drop
- Test responsive behavior on smaller screens
- Test keyboard navigation and accessibility

### 9. Run Validation Commands
- Execute all validation commands listed below to ensure feature works correctly with zero regressions
- Fix any test failures or build errors
- Verify E2E test passes successfully

## Testing Strategy
### Unit Tests
- Test TaskDetailModal component renders correctly with complete task data
- Test TaskDetailModal closes when backdrop is clicked
- Test TaskDetailModal closes when ESC key is pressed
- Test TaskDetailModal displays correct status badge color for each status
- Test TaskDetailModal handles missing optional fields (assignee, deadline, description)
- Test TaskCard opens modal when "Show details" button is clicked
- Test backend API accepts and saves assignee field correctly

### Edge Cases
- Task with no description - modal should handle gracefully
- Task with no assignee - modal should display "Unassigned" or leave field empty
- Task with no deadline - modal should display "No deadline" or leave field empty
- Very long task descriptions - modal should scroll or truncate appropriately
- Very long assignee names - should not break layout
- Opening modal while dragging a task - should not conflict with DnD
- Rapid clicking of "Show details" button - should handle gracefully
- Multiple task cards - ensure correct task data is shown in modal

## Acceptance Criteria
- [x] "Show details" button opens a modal dialog instead of inline toggle
- [x] Modal displays task status with colored badge matching column colors
- [x] Modal displays task title prominently as header
- [x] Modal displays full task description
- [x] Modal displays assignee field (with graceful handling if empty)
- [x] Modal displays deadline field (with graceful handling if empty)
- [x] Modal can be closed by clicking close button (X)
- [x] Modal can be closed by clicking backdrop overlay
- [x] Modal can be closed by pressing ESC key
- [x] Backend Task model includes assignee field
- [x] Backend API supports creating tasks with assignee
- [x] Backend API supports updating task assignee
- [x] Frontend Task type includes assignee and deadline fields
- [x] Modal is responsive and works on mobile devices
- [x] Modal does not interfere with drag-and-drop functionality
- [x] All backend tests pass without errors
- [x] All frontend tests pass without errors
- [x] Frontend builds successfully without errors
- [x] E2E test validates complete functionality

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `cd app/backend && npm test` - Run backend tests to validate the feature works with zero regressions
- `cd app/frontend && npm test` - Run frontend tests to validate the feature works with zero regressions
- `cd app/frontend && npm run build` - Run frontend build to validate the feature works with zero regressions
- Read `.claude/commands/e2e/test_task_detail_modal.md` and execute the E2E test steps to validate the task detail modal functionality works as expected

## Notes
### Data Model Alignment
The backend and frontend currently have some inconsistencies in their Task models:
- Backend uses `dueDate` while frontend doesn't have deadline field at all
- Backend has `completed: boolean` while frontend has `status: 'todo' | 'in-progress' | 'done'`

For this feature, we'll maintain these differences but add:
- Frontend: `assignee?: string` and `deadline?: string` (mapping to backend's dueDate)
- Backend: `assignee?: string`

### Future Enhancements
This feature creates a foundation for additional functionality:
- Edit task details directly in the modal (Phase 2 feature)
- Add due date picker widget for setting deadlines
- Add assignee dropdown with predefined user list
- Display task history/audit log in modal
- Add task comments or notes section
- Add task priority indicator
- Show task relationships or dependencies

### UI/UX Considerations
- Modal should have smooth animations for better user experience
- Status badge colors should exactly match the column colors for consistency
- Consider adding keyboard shortcuts (e.g., arrow keys to navigate between tasks)
- Ensure modal is accessible (ARIA labels, focus management)
- On mobile, modal should occupy most of the screen for better readability

### Technical Considerations
- Use React Portal for modal rendering to avoid z-index issues
- Implement focus trap to keep keyboard navigation within modal
- Use `useEffect` to add/remove ESC key listener
- Consider using a modal library like `react-modal` or build from scratch for learning
- Ensure modal state is properly cleaned up on unmount
