#!/usr/bin/env bash

export PUBLIC_CHAIN_BRIDGE_ADDRESS=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainBridgeAddress --query "Parameter.Value" --output text`
export PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainAlisTokenAddress --query "Parameter.Value" --output text`
export PUBLIC_CHAIN_REGISTRY_ADDRESS=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainRegistryAddress --query "Parameter.Value" --output text`
export PUBLIC_CHAIN_OPERATION_URL=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainOperationUrl --query "Parameter.Value" --output text`
export DAILY_LIMIT_TOKEN_SEND_VALUE=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmDailyLimitTokenSendValue --query "Parameter.Value" --output text`

yarn nuxt build
