# Analyze DataFlow

Generate a concise visualization of data flow, types, and business logic for a specific feature or module.

## Variables
analysis_target: $1 (e.g., "batch_pr_resolver flow", "how worktrees are created", "what happens when webhook receives an issue", "the retry logic in test resolution")

## Purpose

You are analyzing code to extract the **essential flow diagram** that shows:
1. **Data flow** - How data moves through the system (user input → processing → output)
2. **Types** - What data structures are involved at each step
3. **Business logic** - Key decision points and conditional branches

This is NOT documentation. This is a **mental model** to help understand what the code does before modifying it.

## Instructions

### Step 1: Understand Analysis Target

Parse the **analysis_target** to understand what to analyze:

**If it's a specific file** (e.g., `adw_batch_resolver_iso.py`):
- Read that file directly
- Identify the main entry point (usually `main()` or workflow function)

**If it's a feature/concept** (e.g., "batch PR resolver", "webhook processing"):
- Search for related files using `Glob` (e.g., `**/batch*.py`, `**/webhook*.py`)
- Use `Grep` to find key functions or classes
- Identify the primary file(s) that implement this

**If it's a specific flow question** (e.g., "what happens when a test fails", "retry logic"):
- Search for relevant code using `Grep` (search for "retry", "test.*fail", etc.)
- Find the file(s) containing this logic
- Focus ONLY on that specific part of the flow

**If it's a subsystem** (e.g., "state management", "port allocation"):
- Look in `adw_modules/` for the relevant module
- Identify the main functions/classes

### Step 2: Extract Core Flow

Read the main file(s) and identify:

1. **Entry point** - What triggers this flow? (user action, API call, event, etc.)
2. **Sequential steps** - What happens in order?
3. **Decision points** - Where does the flow branch? (if/else, loops, error handling)
4. **Data transformations** - How does data change shape as it flows?
5. **Exit points** - What are the possible outcomes?

**Focus on**:
- The MAIN path (happy path)
- Critical error paths (what causes rollback, retry, failure)
- Loop/iteration logic

**Ignore**:
- Logging statements
- Minor validation checks
- Implementation details of helper functions (unless critical to flow)

### Step 3: Identify Types

For each major step, extract:
- **Input types** - What data structure comes in?
- **Processing** - What happens to it?
- **Output types** - What data structure goes out?

Look for:
- Pydantic models (in `data_types.py` or model definitions)
- Function signatures with type hints
- Data structure creation (dict, list, object instantiation)
- API payloads (requests/responses)

### Step 4: Extract Business Logic

Identify the KEY decisions:
- "If X then Y, otherwise Z"
- "Retry N times if condition"
- "For each item, do X until Y"
- "If error, rollback and stop"

**Keep it brief** - Only the ESSENTIAL logic, not implementation details.

### Step 5: Generate Flow Diagram

Create a **simple, ASCII-style flow diagram** similar to this format:

```
## Feature Name Flow

  entry point (what triggers this)
      ↓
  step 1: action description
      type: InputType → processing → OutputType
      ↓
  decision point?
      ↓ YES
      action if yes
      type: Type → processing → Type
          ↓
          nested decision or loop?
              ↓
              action
              ↓
              condition met?
                  ↓ YES
                  continue
                  ↓ NO (retry)
                  rollback action
                  ↓ (after N attempts)
                  mark as failed, stop
      ↓ NO
      alternative action
      ↓
  step N: final action
      type: FinalInput → processing → FinalOutput
      ↓
  outcome(s)
```

### Step 6: Add Types & Business Logic Annotations

**Types Section** (if complex):
```
### Key Types:
- InputType: { field1: str, field2: int, ... }
- ProcessingType: { ... }
- OutputType: { ... }
```

**Business Logic Notes** (if not obvious from flow):
```
### Key Logic:
- Retry strategy: up to N attempts with exponential backoff
- Rollback: git reset --hard HEAD~1 if tests fail
- Validation: X must be Y, otherwise abort
```

## Constraints

- DO NOT generate full documentation
- DO NOT include code snippets (unless 1-2 lines for clarity)
- DO NOT list every function - only the MAIN flow
- DO focus on the big picture, not implementation details
- DO keep it under 50 lines if possible
- DO use simple arrows (→, ↓) and indentation for clarity

## Output Format

Return the flow diagram as plain text markdown. Use this structure:

```markdown
## {Feature Name} Flow

{flow diagram with arrows and indentation}

### Key Types (if needed):
{brief type descriptions}

### Business Logic (if needed):
{critical decision logic}
```

## Examples

**Good Example 1: Batch PR Resolver**
```
## Batch PR Conflict Resolver Flow

  user wants to merge PRs [21, 22, 23]
      ↓
  create integration branch from main
      ↓
  for each PR in sequence:
      ↓
      merge PR into integration branch
      ↓
      conflicts?
          ↓ YES
          attempt to auto-resolve with LLM
              ↓
              run tests
              ↓
              tests pass?
                  ↓ NO (retry up to 4 times)
                  git reset --hard HEAD~1 (rollback)
                  ↓
                  retry resolution
                      ↓
                      tests pass?
                          ↓ YES
                          continue to next PR
                          ↓ NO (after 4 attempts)
                          mark as failed, stop process
          ↓ NO
          continue to next PR
      ↓
  all PRs merged successfully
      ↓
  create final PR: integration_branch → main
```

**Good Example 2: Worktree Creation**
```
## Worktree Creation Flow

  user requests new worktree for issue #123
      type: issue_number: int
      ↓
  generate adw_id (8-char hash)
      ↓
  calculate ports based on adw_id
      type: backend_port: int (9100-9114), frontend_port: int (9200-9214)
      ↓
  create git worktree at trees/{adw_id}/
      ↓
  success?
      ↓ YES
      create state file: agents/{adw_id}/adw_state.json
          type: ADWStateData
      ↓
      write .ports.env to worktree
      ↓
  return: { adw_id, worktree_path, ports }

### Key Types:
- ADWStateData: { adw_id, issue_number, branch_name, worktree_path, backend_port, frontend_port, model_set }
```

**Bad Example** (too detailed):
```
## Worktree Creation Flow

Step 1: Import dependencies
  - import subprocess
  - import os
  - import json

Step 2: Define create_worktree function
  - Parameters: issue_number, adw_id=None
  - Validate issue_number is integer
  - If adw_id is None, generate using hashlib.sha256
  - Check if issue_number > 0
  ...
[This is too granular - focus on the FLOW, not implementation]
```

## Your Task

For the analysis target: **{analysis_target}**

1. Interpret what the user wants to understand
2. Find the relevant code files
3. Read and understand the flow (could be full feature or just a specific part)
4. Extract types, data flow, and business logic
5. Generate a concise flow diagram (use the examples above as reference)
6. Return ONLY the flow diagram in markdown format

**Remember**: This is for the USER'S understanding before making changes. Keep it simple and focused on what they asked about.
