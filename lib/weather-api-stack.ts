import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Construct} from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class WeatherApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Créer une fonction Lambda

    const currentWeather = new lambda.Function(this, 'CurrentWeatherHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
    });

    // Créer une API Gateway REST API
    const api = new apigateway.RestApi(this, 'weather-api');

    // Ajouter un intégrateur Lambda à l'API
    const integration = new apigateway.LambdaIntegration(currentWeather);

    // Ajouter une méthode GET à l'API
    api.root.addMethod('GET', integration);
  }
}
