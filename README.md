# frontend-application
[![CircleCI](https://circleci.com/gh/AlisProject/frontend-application.svg?style=svg)](https://circleci.com/gh/AlisProject/frontend-application)

# Prerequisite
- nodenv
- yarn
- serverless
- aws cli
- direnv

# Environment valuables
```bash
# Create .envrc to suit your environment.
cp -pr .envrc.sample .envrc
vi .envrc # edit

# allow
direnv allow
```

Also, you should use variables in `.envrc.sample.develop` when you are developing.

# Build and deployment

## Install dependencies
```bash
# install dependencies
nodenv install
yarn
```

## Deployment

```bash
./deploy.sh
```

# Development

## Serve with hot reload at localhost:3000
```bash
yarn dev
```

## Launch server
```bash
yarn start
```

## Generate static project
```bash
yarn generate
```

# AWS CodePipeline for deployment

1. [Get GitHub access token](https://github.com/settings/tokens)
1. `direnv edit`
1. Deploy CloudFormation stack.

```bash
# Create S3 deploying bucket.
aws s3 mb s3://${ALIS_APP_ID}-frontend-codepipeline-deploy-bucket

# deploy
./deploy_codepipeline.sh
``` 
