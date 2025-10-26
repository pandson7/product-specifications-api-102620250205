import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class ProductSpecificationsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '102620250205';

    // DynamoDB Table
    const table = new dynamodb.Table(this, `ProductSpecifications-${suffix}`, {
      tableName: `ProductSpecifications-${suffix}`,
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Enable auto scaling
    table.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    table.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    // Global Secondary Indexes
    table.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'BrandIndex',
      partitionKey: { name: 'brand', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });

    // Lambda Functions
    const getProductFunction = new lambda.Function(this, `GetProduct-${suffix}`, {
      functionName: `GetProduct-${suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getProduct.handler',
      code: lambda.Code.fromAsset('../lambda'),
      environment: {
        TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    const listProductsFunction = new lambda.Function(this, `ListProducts-${suffix}`, {
      functionName: `ListProducts-${suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'listProducts.handler',
      code: lambda.Code.fromAsset('../lambda'),
      environment: {
        TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // Grant DynamoDB permissions
    table.grantReadData(getProductFunction);
    table.grantReadData(listProductsFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, `ProductSpecificationsApi-${suffix}`, {
      restApiName: `ProductSpecificationsApi-${suffix}`,
      description: 'API for accessing product specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    const products = api.root.addResource('products');
    
    // GET /products
    products.addMethod('GET', new apigateway.LambdaIntegration(listProductsFunction));
    
    // GET /products/{id}
    const productById = products.addResource('{id}');
    productById.addMethod('GET', new apigateway.LambdaIntegration(getProductFunction));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
      description: 'DynamoDB Table Name',
    });
  }
}
