# Product Specifications API

A serverless REST API for accessing product specifications with flexible JSON schema support, built on AWS using CDK.

## Architecture

- **API Gateway**: REST API endpoints with CORS support
- **Lambda Functions**: Node.js 22.x runtime for business logic
- **DynamoDB**: NoSQL database with Global Secondary Indexes
- **CDK**: Infrastructure as Code for deployment

## API Endpoints

### Base URL
```
https://cd7le0c65a.execute-api.us-east-1.amazonaws.com/prod/
```

### Endpoints

#### 1. Get All Products
```http
GET /products
```

**Query Parameters:**
- `category` (optional): Filter by product category
- `brand` (optional): Filter by product brand
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20, max: 100)

**Example Requests:**
```bash
# Get all products
curl "https://cd7le0c65a.execute-api.us-east-1.amazonaws.com/prod/products"

# Filter by category
curl "https://cd7le0c65a.execute-api.us-east-1.amazonaws.com/prod/products?category=Electronics"

# Filter by brand
curl "https://cd7le0c65a.execute-api.us-east-1.amazonaws.com/prod/products?brand=Apple"

# Pagination
curl "https://cd7le0c65a.execute-api.us-east-1.amazonaws.com/prod/products?page=1&pageSize=5"
```

#### 2. Get Product by ID
```http
GET /products/{id}
```

**Example Request:**
```bash
curl "https://cd7le0c65a.execute-api.us-east-1.amazonaws.com/prod/products/ELEC001"
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "productId": "ELEC001",
    "name": "iPhone 15 Pro",
    "category": "Electronics",
    "brand": "Apple",
    "specifications": {
      "color": "Space Black",
      "storage": "256GB",
      "display": "6.1-inch Super Retina XDR",
      "processor": "A17 Pro chip",
      "camera": "48MP Main camera",
      "weight": "187g",
      "dimensions": {
        "length": 146.6,
        "width": 70.6,
        "height": 8.25
      }
    },
    "createdAt": "2025-10-26T06:13:29.116Z",
    "updatedAt": "2025-10-26T06:13:29.116Z"
  },
  "correlationId": "a9a51725-b76e-4f48-8cf2-087312ce75c3"
}
```

### List Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 10,
    "totalPages": 1,
    "hasMore": false
  },
  "filters": {
    "category": null,
    "brand": null
  },
  "correlationId": "38354ead-cfff-4f5c-9a94-4ccf9979a42f"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 'NONEXISTENT' not found",
    "correlationId": "408037be-85eb-40d5-b340-91532e09881f"
  }
}
```

## Sample Data

The API includes sample products across multiple categories:

### Electronics (3 products)
- iPhone 15 Pro (Apple)
- MacBook Pro 14-inch (Apple)
- Galaxy S24 Ultra (Samsung)

### Clothing (3 products)
- Classic Cotton T-Shirt (Nike)
- Denim Jeans (Levi's)
- Running Shoes (Adidas)

### Home & Garden (2 products)
- Coffee Maker (Keurig)
- Dining Table (IKEA)

### Sports & Outdoors (2 products)
- Mountain Bike (Trek)
- Yoga Mat (Manduka)

## Flexible Schema

Products support flexible JSON specifications. Each product can have unique attributes:

```json
{
  "specifications": {
    "color": "Space Black",
    "storage": "256GB",
    "dimensions": {
      "length": 146.6,
      "width": 70.6,
      "height": 8.25
    },
    "features": ["Feature1", "Feature2"],
    "customAttribute": "Custom Value"
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MISSING_PRODUCT_ID` | 400 | Product ID parameter is missing |
| `PRODUCT_NOT_FOUND` | 404 | Product with specified ID not found |
| `INTERNAL_SERVER_ERROR` | 500 | Server error occurred |

## Deployment

### Prerequisites
- AWS CLI configured
- Node.js 18+ installed
- AWS CDK installed (`npm install -g aws-cdk`)

### Deploy
```bash
cd cdk-app
npm install
npm run build
npx cdk deploy --require-approval never
```

### Populate Sample Data
```bash
npm install
node populate-data.js
```

## AWS Resources Created

- **DynamoDB Table**: `ProductSpecifications-102620250205`
- **Lambda Functions**: 
  - `GetProduct-102620250205`
  - `ListProducts-102620250205`
- **API Gateway**: `ProductSpecificationsApi-102620250205`
- **IAM Roles**: Service roles for Lambda functions
- **CloudWatch Logs**: Log groups for Lambda functions

## Performance Features

- **Auto Scaling**: DynamoDB read/write capacity auto scaling
- **Efficient Queries**: Global Secondary Indexes for category and brand filtering
- **Pagination**: Prevents large result sets
- **Correlation IDs**: Request tracing for debugging

## Security Features

- **CORS**: Configured for cross-origin requests
- **IAM**: Least privilege access for Lambda functions
- **Input Validation**: Parameter validation and sanitization
- **Error Handling**: Secure error messages without sensitive data exposure

## Testing

All endpoints have been tested with sample data:

1. ✅ Get all products - Returns 10 sample products
2. ✅ Get specific product - Returns iPhone 15 Pro details
3. ✅ Filter by category - Returns 3 Electronics products
4. ✅ Filter by brand - Returns 2 Apple products
5. ✅ Error handling - Returns 404 for non-existent product

## Cleanup

To remove all AWS resources:
```bash
cd cdk-app
npx cdk destroy
```
