#!/bin/bash
set -o errexit
set -o nounset
cd "`dirname \"$0\"`"

pid=`ps ax | grep 'firebase emulators:start' | grep -v grep | cut -d' ' -f1`
if [ "$pid" != "" ]; then
    echo "local emulator already running; replacing PID $pid"
    kill $pid
fi
firebase emulators:start --only firestore > /dev/null 2> /dev/null &
echo "firebase emulators are now running in the background as PID $!"
