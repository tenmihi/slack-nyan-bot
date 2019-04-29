import path = require('path');
import cdk = require('@aws-cdk/cdk');
import lambda = require('@aws-cdk/aws-lambda');
import apigateway = require("@aws-cdk/aws-apigateway");

import toml = require("toml");
const { readFileSync } = require("fs");

export class SlackNyanBotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const file = readFileSync(path.join(__dirname, "./lambda-env.toml"));
    const env = toml.parse(file);

    // The code that defines your stack goes here
    const handler = new lambda.Function(this, 'SlackBot', {
      runtime: lambda.Runtime.NodeJS810,
      handler: 'index.handler',
      code: lambda.Code.asset(path.join(__dirname, '../lambda')),
      environment: env,
    });

    const api = new apigateway.RestApi(this, id, {
      restApiName: "test_api",
      description: "nyan"
    });

    const integration = new apigateway.LambdaIntegration(handler);
    api.root.addMethod("POST", integration, {});
  }
}