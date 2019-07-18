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

## Build

```bash
yarn build
```

## Deployment

```bash
yarn deploy

# Re install dependencies
yarn
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
