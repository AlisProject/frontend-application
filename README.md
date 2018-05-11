# frontend-application
[![CircleCI](https://circleci.com/gh/AlisProject/frontend-application.svg?style=svg)](https://circleci.com/gh/AlisProject/frontend-application)

# Prerequisite 
- ndenv
- yarn
- serverless
- aws cli
- direnv

## Environment valuables

```bash
# Create .envrc to suit your environment.
cp -pr .envrc.sample .envrc
vi .envrc # edit

# allow
direnv allow
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
