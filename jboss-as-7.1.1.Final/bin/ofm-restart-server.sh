#!/bin/bash
JBOSS_INSTANCE=$(ps -afe | grep "$1" | grep -v grep | cut -d' ' -f 32 | cut -d'/' -f 5)
echo $JBOSS_INSTANCE
echo 'sleeping for 5 sec'
sleep 5
echo 'killing process '$1
kill -9 $1
echo 'starting instance '$JBOSS_INSTANCE
/etc/init.d/$JBOSS_INSTANCE start
