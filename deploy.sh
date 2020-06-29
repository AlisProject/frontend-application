#!/usr/bin/env bash
set -e

# SSMからNuxtのビルドに必要な値を取得し、環境変数へ格納
# exportと一緒に記述すると、exportは成功とみなされてSSMの取得が失敗した場合でもスクリプトが継続してしまう
# 値の取得に失敗した際には終了させたいので、2行に取得処理を分けている
DIST_S3_BUCKET_NAME=`aws ssm get-parameter --name ${ALIS_APP_ID}ssmDistS3BucketName --query "Parameter.Value" --output text`
export DIST_S3_BUCKET_NAME=${DIST_S3_BUCKET_NAME}

# リソースをS3へアップロード
aws s3 cp .nuxt/dist/client s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist --recursive --cache-control "public, max-age=31536000" --metadata-directive REPLACE
aws s3 cp app/static/favicon.ico s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/
aws s3 cp app/static/OGP_1200×630.png s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/
aws s3 cp app/static/icon_user_noimg.png s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/
aws s3 cp app/static/touch-icon.png s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/
aws s3 cp app/static/header_logo_original.png s3://${DIST_S3_BUCKET_NAME}/d/nuxt/dist/

# yarn.lockの内容で、本番で使用するパッケージだけをインストール
yarn install --production --frozen-lockfile

yarn sls:deploy
