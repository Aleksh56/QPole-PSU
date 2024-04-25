#!/bin/bash

pkill -f ganache-cli
killall -q ganache-cli
ps aux | grep ganache

nohup ganache-cli --host 0.0.0.0 > ganache_output.txt 2>&1 &
GANACHE_PID=$!

sleep 5

truffle migrate

sleep 5

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

if [ -n "$CONTRACT_ADDRESS" ]; then
  echo $CONTRACT_ADDRESS > contract_address.txt
else
  echo "Contract not found or ganache-cli did not output as expected."
fi

cp contract_address.txt /home/server/qpoll

cp /home/blockchain/build/contracts/MiniPoll.json /home/server/qpoll