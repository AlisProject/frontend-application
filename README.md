# frontend-application
[![CircleCI](https://circleci.com/gh/AlisProject/frontend-application.svg?style=svg)](https://circleci.com/gh/AlisProject/frontend-application)

# Prerequisite 
- ndenv
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

# Build and deployment

## Install dependencies
```bash
# install dependencies
ndenv install
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
