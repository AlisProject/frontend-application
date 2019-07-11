#!/usr/bin/env bash

aws s3 cp .nuxt/dist/client s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist --recursive
aws s3 cp app/static/favicon.ico s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/
aws s3 cp app/static/OGP_1200×630.png s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/
aws s3 cp app/static/icon_user_noimg.png s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/
aws s3 cp app/static/touch-icon.png s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/
aws s3 cp app/static/header_logo_original.png s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/

# yarn.lockの内容で、本番で使用するパッケージだけをインストール
yarn install --production --frozen-lockfile

yarn sls:deploy
