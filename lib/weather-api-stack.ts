import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';

export class WeatherApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Créer une fonction Lambda

    const currentWeather = new lambda.Function(this, 'CurrentWeatherHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist'),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    // API Gateway REST API
    const api = new apigateway.RestApi(this, 'weather-api');

    const integration = new apigateway.LambdaIntegration(currentWeather);
    api.root.addMethod('GET', integration);
  }
}
