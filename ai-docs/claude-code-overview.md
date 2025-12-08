# Claude Code Overview

> Источник: https://code.claude.com/docs/en/overview

## Что такое Claude Code?

Claude Code — официальный агентный инструмент для кодирования от Anthropic, который работает в терминале. Помогает разработчикам превращать идеи в код быстрее.

## Ключевые возможности

### 1. Создание фич из описаний
- Пишет код по описанию на обычном языке
- Создаёт план, пишет код и проверяет работоспособность

### 2. Отладка и исправление ошибок
- Описываешь баг или вставляешь сообщение об ошибке
- Claude анализирует кодовую базу и находит проблемы
- Автоматически реализует исправления

### 3. Навигация по кодовой базе
- Задавай вопросы о структуре проекта
- Получай продуманные ответы
- Может получать актуальную информацию из веба
- Интеграция с MCP (Google Drive, Figma, Slack)

### 4. Автоматизация рутинных задач
- Исправление lint-ошибок
- Разрешение merge-конфликтов
- Написание release notes
- Запуск в CI/CD пайплайнах

## Философия Unix

Claude Code — composable и scriptable:

```bash
# Мониторинг логов с уведомлениями
tail -f app.log | claude -p "Slack me if you see anomalies"

# Автоматический перевод в CI
claude -p "If there are new strings, translate to French and raise a PR"
```

## Способы использования

| Способ | Описание |
|--------|----------|
| **CLI** | Нативный терминал, scriptable |
| **VS Code Extension** | Графический интерфейс в IDE |
| **Desktop App** | Локальное или облачное выполнение |
| **Web Interface** | Облачное асинхронное выполнение |
| **JetBrains IDEs** | IntelliJ, PyCharm, WebStorm |
| **CI/CD** | GitHub Actions, GitLab CI/CD |
| **Slack** | Делегирование задач из Slack |

## Быстрый старт

```bash
# Установка
curl -fsSL https://claude.ai/install.sh | bash

# Использование
cd your-project
claude
```

## Расширенные возможности

- **Subagents** — специализированные AI-субагенты для конкретных задач
- **Skills** — модульные возможности, расширяющие функционал
- **Hooks** — кастомизация поведения shell-командами
- **MCP** — подключение к внешним инструментам
- **Headless Mode** — программный запуск без UI

## Конфигурация

- Глобальные и проектные настройки
- Настройка моделей (включая алиасы типа `opusplan`)
- Управление памятью между сессиями
- Переменные окружения

## Полезные ссылки

- [Документация](https://code.claude.com/docs)
- [Quickstart](https://code.claude.com/docs/en/quickstart)
- [Common Workflows](https://code.claude.com/docs/en/common-workflows)
