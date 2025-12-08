# Claude Code Subagents

> Источник: https://code.claude.com/docs/en/sub-agents

## Что такое Subagents?

**Subagents** — специализированные AI-ассистенты в Claude Code для конкретных типов задач. Каждый субагент:

- Имеет конкретную цель и область экспертизы
- Использует собственное контекстное окно (отдельно от основного разговора)
- Может иметь ограниченный набор инструментов
- Включает кастомный системный промпт

## Преимущества

| Преимущество | Описание |
|--------------|----------|
| **Сохранение контекста** | Каждый субагент работает в своём контексте |
| **Специализация** | Настроен для конкретной области → выше успешность |
| **Переиспользуемость** | Один раз создал — используй везде |
| **Гибкие права** | Разные субагенты могут иметь разный доступ к инструментам |

## Быстрый старт

```bash
# Открыть интерфейс субагентов
/agents

# Использовать субагент
> Use the code-reviewer subagent to check my recent changes
```

## Расположение файлов

| Тип | Путь | Область | Приоритет |
|-----|------|---------|-----------|
| **Project** | `.claude/agents/` | Текущий проект | Высший |
| **User** | `~/.claude/agents/` | Все проекты | Ниже |

## Формат файла

```markdown
---
name: your-sub-agent-name
description: Описание когда использовать этот субагент
tools: tool1, tool2, tool3  # Опционально
model: sonnet  # Опционально: sonnet, opus, haiku, inherit
---

Системный промпт субагента.

Конкретные инструкции, лучшие практики,
ограничения которым субагент должен следовать.
```

## Встроенные субагенты

### General-Purpose
- **Модель**: Sonnet
- **Инструменты**: Все
- **Цель**: Сложные исследования, многошаговые операции

### Plan
- **Модель**: Sonnet
- **Инструменты**: Read, Glob, Grep, Bash
- **Цель**: Исследование в plan mode

### Explore
- **Модель**: Haiku (быстрый)
- **Режим**: Только чтение
- **Уровни**: quick, medium, very thorough

## Примеры субагентов

### Code Reviewer

```markdown
---
name: code-reviewer
description: Expert code review. Use PROACTIVELY after writing code.
tools: Read, Grep, Glob, Bash
---

You are a senior code reviewer.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code clarity and readability
- Proper error handling
- No exposed secrets
- Good test coverage

Provide feedback by priority:
- Critical (must fix)
- Warnings (should fix)
- Suggestions (consider)
```

### Debugger

```markdown
---
name: debugger
description: Debugging specialist. Use PROACTIVELY when encountering errors.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger.

Process:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate failure location
4. Implement minimal fix
5. Verify solution

Focus on fixing the underlying issue, not symptoms.
```

## CLI конфигурация

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after changes.",
    "prompt": "You are a senior code reviewer...",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

## Явный вызов

```bash
> Use the test-runner subagent to fix failing tests
> Have the code-reviewer subagent look at my recent changes
> Ask the debugger subagent to investigate this error
```

## Возобновление субагента

```bash
# Первый вызов
> Use the code-analyzer agent to review authentication module
[Agent returns agentId: "abc123"]

# Возобновить
> Resume agent abc123 and analyze authorization logic
[Agent continues with full context]
```

## Best Practices

- **Начинай с генерации Claude** — сгенерируй субагент, потом кастомизируй
- **Фокусированные субагенты** — одна чёткая ответственность
- **Детальные промпты** — больше инструкций = лучше результат
- **Ограничивай инструменты** — только необходимые для задачи
- **Version control** — коммить проектные субагенты в git

## Полезные ссылки

- [Plugins](https://code.claude.com/docs/en/plugins)
- [Slash Commands](https://code.claude.com/docs/en/slash-commands)
- [Hooks](https://code.claude.com/docs/en/hooks)
