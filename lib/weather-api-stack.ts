import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';

export class WeatherApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the Dynamo DB Table
    const table = new dynamodb.Table(this, 'WeatherCacheTable', {
      tableName: 'weather-cache',
      partitionKey: {name: 'hour', type: dynamodb.AttributeType.STRING},
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Create the lambda
    const currentWeather = new lambda.Function(this, 'CurrentWeatherHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    // Allow lambda to get and put item (no query/no scan)
    currentWeather.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:GetItem', 'dynamodb:PutItem'],
        resources: [table.tableArn],
      }),
    );

    // create API Gateway REST API
    const api = new apigateway.RestApi(this, 'weather-api');

    // Add lambda as GET / endpoint
    const integration = new apigateway.LambdaIntegration(currentWeather);
    api.root.addMethod('GET', integration);
  }
}
