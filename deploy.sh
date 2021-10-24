#!/bin/bash
PATHSRC="/home/m/WhatDoesAHouseWear-ADdress/app"

source production.sh #2 variables are defined there: CREDENTIALS, PATHDEST

cd $PATHSRC &&
find ./ -type f -printf "\n%T@ %P\0" \
| sort -rz \
| xargs -I % sh -c 'echo %' \
| awk '{split($0,a," "); print a[2]}' \
| xargs -I % sh -c "curl -u ${CREDENTIALS} --ftp-pasv --disable-epsv --ftp-create-dirs -T % ${PATHDEST}/%"
