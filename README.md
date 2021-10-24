# What Does A House Wear? - ADdress
Property management software helps landlords and real estate professionals track leases, residents and maintenance tasks, as well as collect rent and manage finances to reduce costs and streamline operations.

# How to install?
You need any linux, I build this app on Ubuntu 18.04.3 LTS (Bionic Beaver)

## Installation steps:
* copy your GIT ~/.ssh/id_rsa and ~/.ssh/id_rsa.pub files
* $ ssh-add
* $ git config --global user.email "email@example.com"
* $ git config --global user.name "name"
* $ git clone git@github.com:marcinpl87/WhatDoesAHouseWear-ADdress.git
* $ cd WhatDoesAHouseWear-ADdress
* $ sudo ./install.sh
* $ gulp
* open localhost:3000 in your browser
* login to wp-admin, select theme and set URLs to /%postname%/
* add production.sh script with 2 variables: CREDENTIALS and PATHDEST to deploy app to your server
