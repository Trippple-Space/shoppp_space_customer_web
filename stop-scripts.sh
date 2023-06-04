#!/bin/bash

CONFIG_FILE="generic.config.json"
DIRECTORY=$(sed -n 's/.*"location": "\(.*\)".*/\1/p' "$CONFIG_FILE")

if [[ -n "$DIRECTORY" ]]; then
  ID=$(pgrep -f "$DIRECTORY/scripts")
  if [[ -n "$ID" ]]; then
    if kill -9 "$ID" &> /dev/null; then
        echo "Processes with ID $ID killed"
        echo "Process with dir $DIRECTORY forcefully killed"
    else
        echo "Failed to forcefully kill process with parent PID $DIRECTORY" >&2
    fi
  else
    echo "No processes found in $DIRECTORY/scripts"
  fi
else
  echo "Directory path not found in $CONFIG_FILE"
fi
