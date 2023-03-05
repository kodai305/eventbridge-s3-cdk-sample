import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class EventbridgeS3CdkSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // Bucket の作成
    const bucket = new s3.Bucket(this, `Sample-EventBridge-S3-Bucket`, {
      eventBridgeEnabled: true,
      bucketName: 'sample-eventbridge-s3bucket-2023'
    });

    // Lambda Function 作成
    const fn = new lambda.Function(this, `Sample-EventBridge-S3-Function`, {
      functionName: `Sample-EventBridge-S3-Function`,
      code: lambda.Code.fromInline( `
        // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
        exports.handler =  async function(event, context) {
          console.log("EVENT: "+ JSON.stringify(event, null, 2))
          return context.logStreamName
        }
      `),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      timeout: cdk.Duration.seconds(3),
    });    

    // EventBridge Rule作成
    const rule = new events.Rule(this, `Sample-EventBridge-S3-Rule`, {
      ruleName: `Sample-EventBridge-S3-Rule`,
      eventPattern: {
        source: [
          "aws.s3"
        ],
        detailType: ["Object Created"],
        resources: [bucket.bucketArn],
        detail: {
          "object": {
            "key": [{
              "suffix": ".txt"
            }]
          }
        }
      },
      targets: [new LambdaFunction(fn)],
    });
  }
}
