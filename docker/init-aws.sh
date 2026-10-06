#!/bin/sh

# 1. Force MiniStack to inject static, permanent IDs
export MINISTACK_COGNITO_USER_POOL_ID="us-east-1_CPGidI0oA"
export MINISTACK_COGNITO_CLIENT_ID="5ca5970yCc1qbz8Bip5l6tDT7C"
export MINISTACK_COGNITO_IDENTITY_POOL_ID="us-east-1:56488b20-5474-4999-8c9e-bd8559980f7e"
export MINISTACK_ACCOUNT_ID="123456789012"

# 2. Create DynamoDB Tables
awslocal dynamodb create-table \
  --table-name Songs \
  --attribute-definitions AttributeName=SongId,AttributeType=S \
  --key-schema AttributeName=SongId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

awslocal dynamodb create-table \
  --table-name Users \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Seed your custom profile metadata
awslocal dynamodb put-item --table-name Users --item '{"id": {"S": "user1"}, "role": {"S": "admin"}, "courses": {"L": [{"M": {"name": {"S": "Intro to AWS"}, "last-payment-date": {"S": "2026-01-01"}}}]}}'
awslocal dynamodb put-item --table-name Users --item '{"id": {"S": "user2"}, "role": {"S": "admin"}, "courses": {"L": []}}'

# 3. Create Cognito User Pool (MiniStack intercepts this and assigns the static ID above)
awslocal cognito-idp create-user-pool \
  --pool-name AcademyPool \
  --schema "Name=role,AttributeDataType=String,Mutable=true"

# 4. Create User Pool Client with explicit auth flows enabled
awslocal cognito-idp create-user-pool-client \
  --user-pool-id us-east-1_CPGidI0oA \
  --client-name AcademyClient \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH ALLOW_ADMIN_USER_PASSWORD_AUTH

# 5. Create users with permanent passwords
awslocal cognito-idp admin-create-user --user-pool-id us-east-1_CPGidI0oA --username user1 --user-attributes Name=custom:role,Value=admin
awslocal cognito-idp admin-set-user-password --user-pool-id us-east-1_CPGidI0oA --username user1 --password Password123! --permanent

awslocal cognito-idp admin-create-user --user-pool-id us-east-1_CPGidI0oA --username user2 --user-attributes Name=custom:role,Value=admin
awslocal cognito-idp admin-set-user-password --user-pool-id us-east-1_CPGidI0oA --username user2 --password Password123! --permanent

echo "VITE_COGNITO_CLIENT_ID=$CLIENT_ID" >> /tmp/ministack-state/.env.local
