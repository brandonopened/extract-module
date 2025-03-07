#!/bin/bash

# Start the backend server
echo "Starting backend server..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload &

# Start the frontend server
echo "Starting frontend server..."
cd ../frontend
npm install
npm run dev &

echo "Both servers are running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo "Press Ctrl+C to stop both servers"

# Wait for both background processes
wait 