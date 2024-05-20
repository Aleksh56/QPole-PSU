#!/bin/bash

PID=$(ps aux | grep 'node start.js' | grep -v grep | awk '{print $2}')

if [ -n "$PID" ]; then
    echo "Stopping existing process with PID: $PID"
    kill $PID
    sleep 10
fi

PID2=$(ps aux | grep 'bash' | grep -v grep | awk '{print $2}')

if [ -n "$PID2" ]; then
    echo "Stopping existing process with PID: $PID2"
    kill $PID2
    sleep 10
fi

echo "Starting new process..."
nohup node start.js > output.log 2>&1 &
echo "New process started with PID: $!"
