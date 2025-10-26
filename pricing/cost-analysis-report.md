# Product Specifications API Cost Analysis Estimate Report

## Service Overview

Product Specifications API is a fully managed, serverless service that allows you to This project uses multiple AWS services.. This service follows a pay-as-you-go pricing model, making it cost-effective for various workloads.

## Pricing Model

This cost analysis estimate is based on the following pricing model:
- **ON DEMAND** pricing (pay-as-you-go) unless otherwise specified
- Standard service configurations without reserved capacity or savings plans
- No caching or optimization techniques applied

## Assumptions

- Standard ON DEMAND pricing model for all services
- US East (N. Virginia) region pricing
- Node.js 18.x runtime for Lambda functions
- 256 MB memory allocation for Lambda functions
- 30-second timeout for Lambda functions
- DynamoDB on-demand billing mode
- No caching enabled for API Gateway
- Standard product data size of 2KB per item
- Average API response time of 200ms
- No data transfer costs between services in same region
- No reserved capacity or savings plans applied

## Limitations and Exclusions

- Data transfer costs between regions
- CloudWatch Logs storage beyond free tier
- X-Ray tracing costs
- Custom domain and SSL certificate costs
- Development and testing environment costs
- Backup and disaster recovery costs
- Monitoring and alerting setup costs
- Security scanning and compliance tools

## Cost Breakdown

### Unit Pricing Details

| Service | Resource Type | Unit | Price | Free Tier |
|---------|--------------|------|-------|------------|
| Amazon API Gateway | Http Requests | million requests (first 300M) | $1.00 | No free tier for API Gateway |
| Amazon API Gateway | Rest Requests | million requests (first 333M) | $3.50 | No free tier for API Gateway |
| AWS Lambda | Requests | 1,000,000 requests | $0.20 | First 1M requests/month and 400,000 GB-seconds/month free |
| AWS Lambda | Compute | GB-second (first 6B GB-seconds) | $0.0000166667 | First 1M requests/month and 400,000 GB-seconds/month free |
| Amazon DynamoDB | Read Requests | million read request read requests | $0.125 | First 25 GB storage/month free, 25 RCU and 25 WCU hours/month free |
| Amazon DynamoDB | Write Requests | million write request write requests | $0.625 | First 25 GB storage/month free, 25 RCU and 25 WCU hours/month free |
| Amazon DynamoDB | Storage | GB-month (beyond 25GB free) | $0.25 | First 25 GB storage/month free, 25 RCU and 25 WCU hours/month free |

### Cost Calculation

| Service | Usage | Calculation | Monthly Cost |
|---------|-------|-------------|-------------|
| Amazon API Gateway | HTTP API with REST endpoints for product retrieval and listing (Low: 1M requests/month, Medium: 5M requests/month, High: 25M requests/month) | Using REST API pricing: Low: $3.50/1M × 1M = $3.50, Medium: $3.50/1M × 5M = $17.50, High: $3.50/1M × 25M = $87.50 | N/A |
| AWS Lambda | Two functions (getProduct, listProducts) with 256MB memory, Node.js 18.x runtime (Low: 1M requests, 200ms avg duration = 51,200 GB-seconds, Medium: 5M requests, 200ms avg duration = 256,000 GB-seconds, High: 25M requests, 200ms avg duration = 1,280,000 GB-seconds) | Low: Free tier covers usage = $0.00 + compute beyond free tier = $0.83, Medium: $0.20 × 4M + $0.0000166667 × 256K = $4.17, High: $0.20 × 24M + $0.0000166667 × 1.28M = $20.83 | N/A |
| Amazon DynamoDB | On-demand table with GSIs for category and brand filtering (Low: 1M reads, 100K writes, 10GB storage, Medium: 5M reads, 500K writes, 50GB storage, High: 25M reads, 2.5M writes, 250GB storage) | Low: $0.125 × 1M + $0.625 × 0.1M + $0.25 × 0GB = $0.125 + $0.0625 + $0 = $0.19 (free tier), Medium: $0.125 × 5M + $0.625 × 0.5M + $0.25 × 25GB = $0.625 + $0.3125 + $6.25 = $7.19, High: $0.125 × 25M + $0.625 × 2.5M + $0.25 × 225GB = $3.125 + $1.5625 + $56.25 = $60.94 | N/A |

### Free Tier

Free tier information by service:
- **Amazon API Gateway**: No free tier for API Gateway
- **AWS Lambda**: First 1M requests/month and 400,000 GB-seconds/month free
- **Amazon DynamoDB**: First 25 GB storage/month free, 25 RCU and 25 WCU hours/month free

## Cost Scaling with Usage

The following table illustrates how cost estimates scale with different usage levels:

| Service | Low Usage | Medium Usage | High Usage |
|---------|-----------|--------------|------------|
| Amazon API Gateway | Varies | Varies | Varies |
| AWS Lambda | Varies | Varies | Varies |
| Amazon DynamoDB | Varies | Varies | Varies |

### Key Cost Factors

- **Amazon API Gateway**: HTTP API with REST endpoints for product retrieval and listing
- **AWS Lambda**: Two functions (getProduct, listProducts) with 256MB memory, Node.js 18.x runtime
- **Amazon DynamoDB**: On-demand table with GSIs for category and brand filtering

## Projected Costs Over Time

The following projections show estimated monthly costs over a 12-month period based on different growth patterns:

Insufficient data to generate cost projections. See Custom Analysis Data section for available cost information.

## Detailed Cost Analysis

### Pricing Model

ON DEMAND


### Exclusions

- Data transfer costs between regions
- CloudWatch Logs storage beyond free tier
- X-Ray tracing costs
- Custom domain and SSL certificate costs
- Development and testing environment costs
- Backup and disaster recovery costs
- Monitoring and alerting setup costs
- Security scanning and compliance tools

### Recommendations

#### Immediate Actions

- Consider using HTTP API instead of REST API for API Gateway to reduce costs by ~70%
- Implement response caching in API Gateway for frequently accessed products
- Optimize Lambda function memory allocation based on actual usage patterns
- Use DynamoDB's eventually consistent reads where strong consistency isn't required
- Implement pagination with reasonable page sizes to reduce data transfer
#### Best Practices

- Monitor CloudWatch metrics to identify optimization opportunities
- Consider Reserved Capacity for DynamoDB if usage patterns are predictable
- Implement proper error handling to avoid unnecessary retries and costs
- Use DynamoDB's batch operations for bulk data operations
- Consider Lambda Provisioned Concurrency only for high-traffic scenarios
- Implement proper logging levels to manage CloudWatch Logs costs



## Cost Optimization Recommendations

### Immediate Actions

- Consider using HTTP API instead of REST API for API Gateway to reduce costs by ~70%
- Implement response caching in API Gateway for frequently accessed products
- Optimize Lambda function memory allocation based on actual usage patterns

### Best Practices

- Monitor CloudWatch metrics to identify optimization opportunities
- Consider Reserved Capacity for DynamoDB if usage patterns are predictable
- Implement proper error handling to avoid unnecessary retries and costs

## Conclusion

By following the recommendations in this report, you can optimize your Product Specifications API costs while maintaining performance and reliability. Regular monitoring and adjustment of your usage patterns will help ensure cost efficiency as your workload evolves.
