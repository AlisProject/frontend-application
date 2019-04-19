#!/usr/bin/env bash

PUBLIC_CHAIN_BRIDGE_ADDRESS=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainBridgeAddress --query "Parameter.Value" --output text`
PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainAlisTokenAddress --query "Parameter.Value" --output text`
PUBLIC_CHAIN_OPERATION_URL=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmPublicChainOperationUrl --query "Parameter.Value" --output text`

yarn cross-env \
    PUBLIC_CHAIN_BRIDGE_ADDRESS=${PUBLIC_CHAIN_BRIDGE_ADDRESS} \
    PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS=${PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS} \
    PUBLIC_CHAIN_OPERATION_URL=${PUBLIC_CHAIN_OPERATION_URL} \
    nuxt build
