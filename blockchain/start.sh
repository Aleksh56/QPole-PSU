#!/bin/bash

# Step 1: Stop ganache-cli if running
pkill -f ganache-cli
killall -q ganache-cli
ps aux | grep ganache

# Step 2: Run truffle migrate

# Step 3: Start ganache-cli
nohup ganache-cli --host 0.0.0.0 > ganache_output.txt 2>&1 &
GANACHE_PID=$!

sleep 5

truffle migrate

# Wait a little for ganache to initialize
sleep 5

# Step 4 and 5: Monitor output for "Contract created:"
CONTRACT_ADDRESS=""
while IFS= read -r line
do
  echo "$line"
  if [[ "$line" == *"Contract created:"* ]]; then
    CONTRACT_ADDRESS=$(echo $line | grep -oP 'Contract created: \K[^ ]+')
    echo "Contract Address: $CONTRACT_ADDRESS"
    break
  fi
done < <(tail -f ganache_output.txt)

# If the contract address was found, store it
if [ -n "$CONTRACT_ADDRESS" ]; then
  echo $CONTRACT_ADDRESS > contract_address.txt
else
  echo "Contract not found or ganache-cli did not output as expected."
fi

# Cleanup: Stop ganache-cli
# kill $GANACHE_PID
