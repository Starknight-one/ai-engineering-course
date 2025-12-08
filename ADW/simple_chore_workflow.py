#!/usr/bin/env python3
"""
Simple ADW Example: Chore -> Implement Workflow

This is a minimal AI Developer Workflow that demonstrates:
1. Creating a plan with /chore
2. Implementing the plan with /implement

Usage:
    python ADW/simple_chore_workflow.py "Add logging to readTasks function"
"""

import subprocess
import sys
import json
from pathlib import Path


def run_claude(prompt: str, print_output: bool = True) -> str:
    """Run Claude Code in programmatic mode and return output."""
    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent.parent  # Project root
    )

    output = result.stdout
    if print_output:
        print(output)

    if result.returncode != 0:
        print(f"Error: {result.stderr}", file=sys.stderr)
        sys.exit(1)

    return output


def main():
    if len(sys.argv) < 2:
        print("Usage: python simple_chore_workflow.py '<chore description>'")
        print("Example: python simple_chore_workflow.py 'Add logging to readTasks'")
        sys.exit(1)

    chore_description = sys.argv[1]

    # Create a simple issue JSON (normally this would come from GitHub)
    issue_json = json.dumps({
        "title": chore_description,
        "body": f"Chore: {chore_description}",
        "number": 1
    })

    print("=" * 60)
    print("STEP 1: Creating plan with /chore")
    print("=" * 60)

    # Step 1: Create plan using /chore command
    plan_output = run_claude(f"/chore 1 1 '{issue_json}'")

    # Extract plan path from output (last non-empty line)
    plan_path = None
    for line in reversed(plan_output.strip().split('\n')):
        if line.strip() and line.strip().endswith('.md'):
            plan_path = line.strip()
            break

    if not plan_path:
        print("Error: Could not find plan path in output")
        sys.exit(1)

    print(f"\nPlan created at: {plan_path}")

    print("\n" + "=" * 60)
    print("STEP 2: Implementing plan with /implement")
    print("=" * 60)

    # Step 2: Implement the plan
    run_claude(f"/implement {plan_path}")

    print("\n" + "=" * 60)
    print("ADW COMPLETE!")
    print("=" * 60)


if __name__ == "__main__":
    main()
