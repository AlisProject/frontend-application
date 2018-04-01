# frontend-application
[![CircleCI](https://circleci.com/gh/AlisProject/frontend-application.svg?style=svg)](https://circleci.com/gh/AlisProject/frontend-application)

# Prerequisite 
- ndenv
- yarn

# Environment valuables

```bash
# AWS region
export REGION=ap-northeast-1

# AWS Cognito informations that made by the ALIS serverless application.
# see: https://github.com/AlisProject/serverless-application
export USER_POOL_ID=ap-northeast-1_1OI5XXXX
export CLIENT_ID=3blv8falksulbexxxxxxxxxxxx

# AWS API Gateway dev stage URL that made by the ALIS serverless application.
# see: https://github.com/AlisProject/serverless-application
export BASE_URL=https://mnz6xxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev

# Iframely API KEY
export IFRAMELY_API_KEY=518401c27dxxxxxxxxxxx
```

# Build Setup

``` bash
# install dependencies
ndenv install
yarn

# serve with hot reload at localhost:3000
yarn dev

# build for production and launch server
yarn build
yarn start

# generate static project
yarn generate
```
