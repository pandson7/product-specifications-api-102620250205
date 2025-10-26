# Product Specifications API - AWS Architecture Diagrams

## Overview
This directory contains three comprehensive AWS architecture diagrams for the Product Specifications API project, generated based on the technical design specifications in `/specs/design.md`.

## Generated Diagrams

### 1. Main Architecture Diagram (`product-specs-api-architecture.png`)
**Purpose**: Shows the complete serverless architecture flow from client to data storage.

**Components Illustrated**:
- API Client (external user/application)
- API Gateway (REST API with routing)
- Lambda Functions:
  - `getProduct` (Node.js 18.x, 256MB, 30s timeout)
  - `listProducts` (Node.js 18.x, 256MB, 30s timeout)
- DynamoDB Components:
  - Main `ProductSpecifications` table
  - `CategoryIndex` Global Secondary Index
  - `BrandIndex` Global Secondary Index
- Monitoring services (CloudWatch, X-Ray)

**Data Flow**:
- Client requests → API Gateway → Lambda functions → DynamoDB operations
- Monitoring and logging integration across all components

### 2. Data Model & Endpoints Diagram (`product-specs-data-model.png`)
**Purpose**: Detailed view of API endpoints, data structure, and database operations.

**Components Illustrated**:
- API Endpoints:
  - `GET /products` (list with pagination)
  - `GET /products/{id}` (single product retrieval)
  - `GET /products?category={category}` (category filtering)
  - `GET /products?brand={brand}` (brand filtering)
- Lambda function routing logic
- DynamoDB table structure with GSIs
- Product data attributes schema

**Key Features**:
- Shows how different endpoints map to Lambda functions
- Illustrates database query patterns for each operation type
- Demonstrates GSI usage for efficient filtering

### 3. Security & Deployment Diagram (`product-specs-security-deployment.png`)
**Purpose**: Focuses on security controls, IAM permissions, and deployment architecture.

**Components Illustrated**:
- Security controls (API throttling at 1000 req/sec)
- IAM roles with minimal permissions
- Lambda function configurations
- DynamoDB on-demand billing setup
- Infrastructure as Code (AWS CDK + CloudFormation)
- Observability stack (CloudWatch Logs, Metrics, X-Ray)

**Security Features**:
- Principle of least privilege IAM roles
- API Gateway throttling protection
- Structured logging and monitoring
- Infrastructure deployment automation

## Technical Specifications Covered

### API Gateway Configuration
- REST API with resource-based routing
- Request throttling (1000 requests/second)
- Integration with Lambda functions

### Lambda Functions
- **Runtime**: Node.js 18.x
- **Memory**: 256 MB
- **Timeout**: 30 seconds
- **Functions**:
  - `getProduct`: Single product retrieval by ID
  - `listProducts`: Product listing with filtering and pagination

### DynamoDB Design
- **Table**: `ProductSpecifications`
- **Partition Key**: `productId` (String)
- **Global Secondary Indexes**:
  - `CategoryIndex`: PK=category, SK=name
  - `BrandIndex`: PK=brand, SK=name
- **Billing**: On-demand for cost optimization

### Monitoring & Observability
- CloudWatch Logs for structured logging
- CloudWatch Metrics for performance monitoring
- X-Ray tracing for request flow analysis
- Custom business metrics tracking

### Security Implementation
- IAM roles with minimal required permissions
- API Gateway throttling protection
- Input validation and sanitization
- Structured error logging with correlation IDs

## Deployment Strategy
- AWS CDK for Infrastructure as Code
- Single CloudFormation stack deployment
- Environment-specific configurations
- Automated resource cleanup capabilities

## File Locations
All diagrams are stored in the `generated-diagrams` directory:
- `/home/pandson/echo-architect-artifacts/product-specifications-api-102620250205/generated-diagrams/product-specs-api-architecture.png`
- `/home/pandson/echo-architect-artifacts/product-specifications-api-102620250205/generated-diagrams/product-specs-data-model.png`
- `/home/pandson/echo-architect-artifacts/product-specifications-api-102620250205/generated-diagrams/product-specs-security-deployment.png`

These diagrams provide a comprehensive visual representation of the serverless Product Specifications API architecture, covering all aspects from client interaction to data storage, security, and deployment automation.
