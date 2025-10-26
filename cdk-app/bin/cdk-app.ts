#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductSpecificationsApiStack } from '../lib/cdk-app-stack';

const app = new cdk.App();
new ProductSpecificationsApiStack(app, 'ProductSpecificationsApiStack-102620250205', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});