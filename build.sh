#!/usr/bin/env bash

export ALIS_APP_DOMAIN=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmAlisAppDomain --query "Parameter.Value" --output text`
export COGNITO_USER_POOL_ID=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmCognitoUserPoolId --query "Parameter.Value" --output text`
export COGNITO_APP_CLIENT_ID=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmCognitoUserPoolAppId --query "Parameter.Value" --output text`
export DIST_S3_BUCKET_NAME=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmDistS3BucketName --query "Parameter.Value" --output text`
export IFRAMELY_API_KEY=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmIframelyApiKey --query "Parameter.Value" --output text`
export PUBLIC_CHAIN_BRIDGE_ADDRESS=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainBridgeAddress --query "Parameter.Value" --output text`
export PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainAlisTokenAddress --query "Parameter.Value" --output text`
export PUBLIC_CHAIN_REGISTRY_ADDRESS=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainRegistryAddress --query "Parameter.Value" --output text`
export PUBLIC_CHAIN_OPERATION_URL=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainOperationUrl --query "Parameter.Value" --output text`
export DAILY_LIMIT_TOKEN_SEND_VALUE=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmDailyLimitTokenSendValue --query "Parameter.Value" --output text`

yarn nuxt build
