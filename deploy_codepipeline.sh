#!/usr/bin/env bash

DEPLOY_BUCKET_NAME=${ALIS_APP_ID}-frontend-codepipeline-deploy-bucket

aws cloudformation deploy \
  --template-file codepipeline.yml \
  --s3-bucket $DEPLOY_BUCKET_NAME \
  --stack-name ${ALIS_APP_ID}frontendcodepipeline \
  --parameter-overrides \
    GitHubToken=${GITHUB_TOKEN} \
    ApprovalEmailAddress=${APPROVAL_EMAIL_ADDRESS} \
    AlisAppId=${ALIS_APP_ID} \
    Region=${AWS_DEFAULT_REGION} \
    # UserPoolId=${COGNITO_USER_POOL_ID} \ FIXME: ALIS-3831
    # ClientId=${COGNITO_APP_CLIENT_ID} \ FIXME: ALIS-3831
    DistS3BucketName=${DIST_S3_BUCKET_NAME} \
    Domain=${DOMAIN} \
    BaseUrl=${BASE_URL} \
    IframelyApiKey=${IFRAMELY_API_KEY} \
    NuxtApiGatewayName=${NUXT_API_GATEWAY_NAME} \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset
