#!/bin/bash
CREDENTIALS=""
PATHSRC=""
PATHDEST=""

cd $PATHSRC &&
find ./ -type f -printf "\n%T@ %P\0" \
| sort -rz \
| xargs -I % sh -c 'echo %' \
| awk '{split($0,a," "); print a[2]}' \
| xargs -I % sh -c "curl -u ${CREDENTIALS} --ftp-pasv --disable-epsv --ftp-create-dirs -T % ${PATHDEST}/%"
