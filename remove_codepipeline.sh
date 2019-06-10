#!/usr/bin/env bash

aws s3 rb --force s3://alis-${ALIS_APP_ID}-frontend-codepipeline
aws cloudformation delete-stack --stack-name ${ALIS_APP_ID}frontendcodepipeline
