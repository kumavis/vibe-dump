#!/bin/bash
# wait while the 1-minute load is over 7, then run the command
while awk '{exit !($1 > 7)}' /proc/loadavg; do timeout 30 tail -f /dev/null; done
exec "$@"
