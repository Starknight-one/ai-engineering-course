# Claude Code Agent Skills

> Источник: https://code.claude.com/docs/en/skills

## Что такое Skills?

**Agent Skills** — модульные возможности, расширяющие функционал Claude. Это **model-invoked** (Claude сам решает когда использовать), а не user-invoked как slash commands.

Skills состоят из:
- Обязательный `SKILL.md` с инструкциями
- Опциональные файлы (скрипты, шаблоны, документация)
- YAML frontmatter с метаданными

## Ключевые характеристики

- Claude автоматически обнаруживает и использует Skills
- Могут быть личными или командными
- Сокращают повторяющийся промптинг
- Автоматизируют рабочие процессы

## Создание Skills

### Расположение

```bash
# Личные Skills (для всех проектов)
~/.claude/skills/my-skill-name/

# Проектные Skills (для команды)
.claude/skills/my-skill-name/
```

### Формат SKILL.md

```markdown
---
name: your-skill-name
description: Краткое описание что делает и когда использовать
allowed-tools: Read, Grep, Glob  # Опционально
---

# Your Skill Name

## Instructions
Чёткие пошаговые инструкции для Claude.

## Examples
Конкретные примеры использования.
```

### Поля frontmatter

| Поле | Обязательно | Описание |
|------|-------------|----------|
| `name` | Да | Lowercase, числа, дефисы (max 64 символа) |
| `description` | Да | Что делает и когда использовать (max 1024) |
| `allowed-tools` | Нет | Ограничить доступные инструменты |

## Важность description

Description критичен для обнаружения Skills:

```yaml
# Плохо
description: Helps with documents

# Хорошо
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.
```

## Примеры Skills

### Commit Message Generator

```markdown
---
name: generating-commit-messages
description: Generates clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes.
---

# Generating Commit Messages

## Instructions

1. Run `git diff --staged` to see changes
2. Suggest a commit message with:
   - Summary under 50 characters
   - Detailed description
   - Affected components

## Best practices

- Use present tense
- Explain what and why, not how
```

### Code Reviewer (с ограничением инструментов)

```markdown
---
name: code-reviewer
description: Review code for best practices. Use when reviewing code, checking PRs, or analyzing quality.
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

## Review checklist

1. Code organization and structure
2. Error handling
3. Performance considerations
4. Security concerns
5. Test coverage

## Instructions

1. Read target files using Read tool
2. Search for patterns using Grep
3. Find related files using Glob
4. Provide detailed feedback
```

### PDF Processing (Multi-file)

```
pdf-processing/
├── SKILL.md
├── FORMS.md
├── REFERENCE.md
└── scripts/
    ├── fill_form.py
    └── validate.py
```

## Управление Skills

### Просмотр

```bash
# Спросить Claude
What Skills are available?

# Файловая система
ls ~/.claude/skills/           # Личные
ls .claude/skills/             # Проектные
```

### Тестирование

Задай вопрос, соответствующий description:
```
Can you help me extract text from this PDF?
```

### Обновление

```bash
code ~/.claude/skills/my-skill/SKILL.md
```

Изменения применяются после перезапуска Claude Code.

### Удаление

```bash
rm -rf ~/.claude/skills/my-skill
# или для проектных
rm -rf .claude/skills/my-skill
```

## Sharing с командой

### Через Git (рекомендуется)

```bash
# Добавить в проект
mkdir -p .claude/skills/team-skill
# Создать SKILL.md

# Закоммитить
git add .claude/skills/
git commit -m "Add team Skill for PDF processing"
git push

# Команда получит автоматически
git pull
```

### Через Plugins

1. Создать plugin со Skills в `skills/` директории
2. Опубликовать в marketplace
3. Команда устанавливает plugin
4. Skills автоматически доступны

## Отладка

### Claude не использует мой Skill

1. **Сделать description конкретнее**
2. **Проверить путь к файлу**
3. **Проверить YAML синтаксис**
4. **Дебаг через CLI**: `claude --debug`

### Конфликт нескольких Skills

Сделать descriptions отличающимися:

```yaml
# Skill 1
description: Analyze sales data in Excel. Use for sales reports, revenue tracking.

# Skill 2
description: Analyze log files and system metrics. Use for debugging, diagnostics.
```

## Best Practices

1. **Фокусированные Skills** — один Skill = одна возможность
2. **Чёткие descriptions** — включай конкретные триггеры
3. **Тестируй с командой** — получай feedback
4. **Документируй версии** — отслеживай изменения

## Интеграция

- **Agent Skills** — доступны в Claude web, Code, Agent SDK
- **Agent SDK** — используй Skills программно (TypeScript, Python)
- **Plugins** — bundle Skills для распространения

## Полезные ссылки

- [Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [Agent SDK Integration](https://docs.claude.com/en/docs/agent-sdk/skills)
