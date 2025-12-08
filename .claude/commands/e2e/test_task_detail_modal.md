# E2E Test: Task Detail Modal

## Test Objective
Validate that the task detail modal opens when clicking "Show details" button and displays all task information correctly (status, title, description, assignee, deadline).

## Prerequisites
- Application is running (both frontend and backend)
- Frontend accessible at http://localhost:3000
- Backend accessible at http://localhost:3001

## Test Steps

### Setup
1. Start the application:
   ```bash
   cd app && ./start.sh
   ```
2. Open browser and navigate to http://localhost:3000
3. Wait for the page to fully load

### Test Case 1: Open Modal from Task Card
**Objective:** Verify modal opens when clicking "Show details" button

1. Locate any task card on the board (e.g., "Setup project structure" in the Done column)
2. Click the "Show Details" button on the task card
3. **Expected Result:**
   - Modal dialog appears with backdrop overlay
   - Modal is centered on screen
   - Task information is displayed in the modal

**Screenshot:** Take a screenshot showing the opened modal with task details visible

### Test Case 2: Verify Modal Content - Complete Task
**Objective:** Verify all task fields are displayed correctly for a task with all fields populated

1. If not already open, open a task that has description (any of the default tasks)
2. **Expected Result:**
   - Status badge is displayed at the top with appropriate color:
     - Blue (#3b82f6) for "To Do"
     - Orange (#f59e0b) for "In Progress"
     - Green (#10b981) for "Done"
   - Task title is displayed as a heading
   - Description section shows the task description
   - Assignee section shows either a name or "Unassigned"
   - Deadline section shows either a date or "Not set"
   - Created date is shown in readable format
   - Last Updated date is shown (if task was updated)

**Screenshot:** Take a screenshot of the modal showing all fields

### Test Case 3: Close Modal with Close Button
**Objective:** Verify modal closes when clicking the X button

1. With modal open, click the "×" (close) button in the top-right corner
2. **Expected Result:**
   - Modal closes smoothly
   - Backdrop disappears
   - Board view is visible again

### Test Case 4: Close Modal with Backdrop Click
**Objective:** Verify modal closes when clicking outside the modal content

1. Open any task detail modal
2. Click on the dark backdrop area (outside the white modal content)
3. **Expected Result:**
   - Modal closes
   - Board view is visible again

### Test Case 5: Close Modal with ESC Key
**Objective:** Verify modal closes when pressing ESC key

1. Open any task detail modal
2. Press the ESC key on keyboard
3. **Expected Result:**
   - Modal closes
   - Board view is visible again

### Test Case 6: Test with Different Task Statuses
**Objective:** Verify status badge color matches column color

1. Open "Setup project structure" task (Done column)
   - **Expected:** Green status badge with "DONE" text
2. Close modal and open "Create components" task (In Progress column)
   - **Expected:** Orange status badge with "IN PROGRESS" text
3. Close modal and open "Implement drag and drop" task (To Do column)
   - **Expected:** Blue status badge with "TO DO" text

**Screenshot:** Take screenshots showing different colored status badges

### Test Case 7: Test with Missing Optional Fields
**Objective:** Verify modal handles missing data gracefully

1. Open any default task (these don't have assignee or deadline set)
2. **Expected Result:**
   - Assignee field shows "Unassigned"
   - Deadline field shows "Not set"
   - No errors or broken layout

**Screenshot:** Take a screenshot showing the graceful handling of missing fields

### Test Case 8: Test Modal Doesn't Interfere with Drag-and-Drop
**Objective:** Verify dragging tasks still works after opening/closing modal

1. Open any task detail modal
2. Close the modal
3. Drag a task from one column to another (e.g., from "To Do" to "In Progress")
4. **Expected Result:**
   - Task moves smoothly between columns
   - Drag-and-drop functionality is not affected

### Test Case 9: Test Responsive Design (Optional - if mobile device available)
**Objective:** Verify modal displays correctly on mobile screens

1. Resize browser window to mobile width (375px) or open on mobile device
2. Open any task detail modal
3. **Expected Result:**
   - Modal occupies full screen on mobile
   - Content is readable and properly formatted
   - Close button is easily accessible

## Validation Checklist
- [ ] Modal opens when clicking "Show details" button
- [ ] Status badge displays correct color for each status
- [ ] Task title is displayed as heading
- [ ] Task description is shown
- [ ] Assignee field is displayed (with "Unassigned" for empty)
- [ ] Deadline field is displayed (with "Not set" for empty)
- [ ] Created date is formatted properly
- [ ] Modal closes with X button
- [ ] Modal closes with backdrop click
- [ ] Modal closes with ESC key
- [ ] Status badge colors match column colors (Blue/Orange/Green)
- [ ] No JavaScript errors in console
- [ ] Drag-and-drop still works after opening modal
- [ ] Modal is responsive on smaller screens

## Success Criteria
All test cases pass and validation checklist items are checked. Screenshots confirm visual appearance and functionality.

## Notes
- If any assignee or deadline data exists in tasks.json, those values should be displayed instead of "Unassigned" or "Not set"
- Test can be enhanced by manually adding assignee and deadline data to tasks via backend API to verify those fields display correctly
- Modal should not prevent scrolling of board when closed
- Modal backdrop should prevent interaction with elements behind it when open
