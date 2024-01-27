#!/bin/bash
set -o errexit
set -o nounset

firestorePort=8404
pid=`lsof -tPi :$firestorePort -sTCP:LISTEN || echo 'port_not_in_use'`
if [ "$pid" != "port_not_in_use" ]; then
    echo "local db emulator port $firestorePort already in use; replacing PID $pid"
    kill $pid
fi
gcloud emulators firestore start --host-port [::1]:$firestorePort > /dev/null 2> /dev/null &
echo "firestore db emulator is now running in the background as PID $!"
