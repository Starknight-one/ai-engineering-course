#!/usr/bin/env python3
"""
Simple ADW Example: Chore -> Implement Workflow

This is a minimal AI Developer Workflow that demonstrates:
1. Creating a plan (spec) based on chore.md template
2. Implementing the plan with implement.md template

Usage:
    python ADW/simple_chore_workflow.py "Add logging to readTasks function"
"""

import subprocess
import sys
import json
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).parent.parent


def load_command_template(name: str) -> str:
    """Load a slash command template from .claude/commands/"""
    template_path = PROJECT_ROOT / ".claude" / "commands" / f"{name}.md"
    if not template_path.exists():
        print(f"Error: Template not found: {template_path}", file=sys.stderr)
        sys.exit(1)
    return template_path.read_text()


def run_claude(prompt: str, print_output: bool = True, allow_write: bool = False) -> str:
    """Run Claude Code in programmatic mode and return output."""
    cmd = ["claude", "-p", prompt]
    if allow_write:
        cmd.insert(1, "--dangerously-skip-permissions")

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        cwd=PROJECT_ROOT
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
    issue_number = "N-A"
    adw_id = "N-A"

    # Create a simple issue JSON (normally this would come from GitHub)
    issue_json = json.dumps({
        "title": chore_description,
        "body": f"Chore: {chore_description}",
        "number": issue_number
    })

    print("=" * 60)
    print("STEP 1: Creating plan (spec)")
    print("=" * 60)

    # Load chore template and substitute variables
    chore_template = load_command_template("chore")
    chore_prompt = chore_template.replace("$1", issue_number)
    chore_prompt = chore_prompt.replace("$2", adw_id)
    chore_prompt = chore_prompt.replace("$3", issue_json)

    # Step 1: Create plan using chore template as prompt
    # allow_write=True needed to create the spec file
    plan_output = run_claude(chore_prompt, allow_write=True)

    # Extract plan path from output (look for .md file path)
    plan_path = None
    for line in reversed(plan_output.strip().split('\n')):
        line = line.strip().strip('`')  # Remove backticks if present
        if line and '.md' in line:
            # Extract just the path (handle cases like `path.md` or path.md)
            if line.endswith('.md'):
                plan_path = line
                break
            # Handle case where .md is followed by backtick or other chars
            match = re.search(r'([\w\-/\.]+\.md)', line)
            if match:
                plan_path = match.group(1)
                break

    if not plan_path:
        print("Error: Could not find plan path in output")
        sys.exit(1)

    # Make path absolute relative to PROJECT_ROOT
    plan_path = PROJECT_ROOT / plan_path

    print(f"\nPlan created at: {plan_path}")

    print("\n" + "=" * 60)
    print("STEP 2: Implementing plan")
    print("=" * 60)

    # Load implement template and read plan content
    implement_template = load_command_template("implement")
    plan_content = Path(plan_path).read_text()
    implement_prompt = implement_template.replace("$ARGUMENTS", plan_content)

    # Step 2: Implement the plan
    # allow_write=True needed to modify source files
    run_claude(implement_prompt, allow_write=True)

    print("\n" + "=" * 60)
    print("ADW COMPLETE!")
    print("=" * 60)


if __name__ == "__main__":
    main()
