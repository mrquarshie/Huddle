@echo off
echo Starting Huddle Development Environment...
echo.

echo Installing server dependencies...
call npm install

echo Installing client dependencies...
cd huddle-frontend
call npm install
cd ..

echo Starting development servers...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.

call npm run dev
