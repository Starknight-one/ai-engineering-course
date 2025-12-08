#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Task Tracker Launcher ===${NC}\n"

# Проверка наличия node_modules
if [ ! -d "backend/node_modules" ]; then
    echo -e "${RED}Backend dependencies not installed!${NC}"
    echo -e "Installing backend dependencies...\n"
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${RED}Frontend dependencies not installed!${NC}"
    echo -e "Installing frontend dependencies...\n"
    cd frontend && npm install && cd ..
fi

# Создание директории для PID файлов
mkdir -p .pids

# Запуск backend
echo -e "${GREEN}Starting backend server...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../.pids/backend.pid
cd ..
echo -e "Backend PID: ${BACKEND_PID}"

# Небольшая задержка для запуска backend
sleep 2

# Запуск frontend
echo -e "${GREEN}Starting frontend server...${NC}"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../.pids/frontend.pid
cd ..
echo -e "Frontend PID: ${FRONTEND_PID}"

echo -e "\n${GREEN}=== Servers started successfully! ===${NC}"
echo -e "${BLUE}Backend:${NC}  http://localhost:3001"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "\n${BLUE}Logs:${NC}"
echo -e "  Backend:  tail -f logs/backend.log"
echo -e "  Frontend: tail -f logs/frontend.log"
echo -e "\n${RED}To stop servers, run:${NC} ./stop.sh"
