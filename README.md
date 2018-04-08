# frontend-application
[![CircleCI](https://circleci.com/gh/AlisProject/frontend-application.svg?style=svg)](https://circleci.com/gh/AlisProject/frontend-application)

# Prerequisite 
- ndenv
- yarn
- serverless
- aws cli

# Environment valuables

```bash
# AWS region
export REGION=ap-northeast-1

# AWS Cognito informations that made by the ALIS serverless application.
# see: https://github.com/AlisProject/serverless-application
export USER_POOL_ID=ap-northeast-1_1OI5XXXX
export CLIENT_ID=3blv8falksulbexxxxxxxxxxxx

# S3 bucket name for dist
export DIST_S3_BUCKET_NAME=alis-bucket-xxxx

# Domain for ALIS
export DOMAIN=example.com

# AWS API Gateway dev stage URL that made by the ALIS serverless application.
# see: https://github.com/AlisProject/serverless-application
export BASE_URL=https://mnz6xxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev

# Iframely API KEY
export IFRAMELY_API_KEY=518401c27dxxxxxxxxxxx

＃ API Gateway name for Nuxt
export NUXT_API_GATEWAY_NAME=alis-gw-xxxx
```

# Build Setup

## command
``` bash
# install dependencies
ndenv install
yarn

# serve with lambda
yarn build
aws s3 cp .nuxt/dist/ s3://$DIST_S3_BUCKET_NAME --recursive --acl public-read
sudo npm install -g serverless
yarn sls:deploy

# serve with hot reload at localhost:3000
yarn dev

# build for production and launch server
yarn build
yarn start

# generate static project
yarn generate
```

## with lambda only
- Set up Custom Domain Name for NUXT_API_GATEWAY_NAME of API Gateway
  https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html
