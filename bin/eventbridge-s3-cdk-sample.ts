#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EventbridgeS3CdkSampleStack } from '../lib/eventbridge-s3-cdk-sample-stack';

const app = new cdk.App();
new EventbridgeS3CdkSampleStack(app, 'EventbridgeS3CdkSampleStack', {
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: '657810388962', region: 'ap-northeast-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});