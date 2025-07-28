@echo off
echo Starter Node.js server...
start cmd /k "npm start"
timeout /t 2 >nul
start http://localhost:3000
