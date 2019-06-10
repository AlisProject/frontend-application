#!/usr/bin/env bash

apt-get install python2.7-dev
curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
python get-pip.py
pip install awscli
npm install -g serverless
./deploy.sh
