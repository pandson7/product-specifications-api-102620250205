const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    const correlationId = event.requestContext?.requestId || 'unknown';
    
    try {
        // Parse query parameters
        const queryParams = event.queryStringParameters || {};
        const category = queryParams.category;
        const brand = queryParams.brand;
        const page = parseInt(queryParams.page) || 1;
        const pageSize = Math.min(parseInt(queryParams.pageSize) || 20, 100); // Max 100 items per page
        
        let command;
        let indexName = null;
        
        if (category) {
            // Query by category using GSI
            command = new QueryCommand({
                TableName: process.env.TABLE_NAME,
                IndexName: 'CategoryIndex',
                KeyConditionExpression: 'category = :category',
                ExpressionAttributeValues: {
                    ':category': category
                },
                Limit: pageSize,
                ExclusiveStartKey: page > 1 ? { category: category, name: `page-${page}` } : undefined
            });
            indexName = 'CategoryIndex';
        } else if (brand) {
            // Query by brand using GSI with partial matching
            command = new QueryCommand({
                TableName: process.env.TABLE_NAME,
                IndexName: 'BrandIndex',
                KeyConditionExpression: 'brand = :brand',
                ExpressionAttributeValues: {
                    ':brand': brand
                },
                Limit: pageSize,
                ExclusiveStartKey: page > 1 ? { brand: brand, name: `page-${page}` } : undefined
            });
            indexName = 'BrandIndex';
        } else {
            // Scan all products
            command = new ScanCommand({
                TableName: process.env.TABLE_NAME,
                Limit: pageSize,
                ExclusiveStartKey: page > 1 ? { productId: `page-${page}` } : undefined
            });
        }

        const result = await docClient.send(command);
        
        // Calculate pagination info
        const totalItems = result.Count || 0;
        const hasMore = !!result.LastEvaluatedKey;
        const totalPages = hasMore ? page + 1 : page;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                data: result.Items || [],
                pagination: {
                    page: page,
                    pageSize: pageSize,
                    totalItems: totalItems,
                    totalPages: totalPages,
                    hasMore: hasMore
                },
                filters: {
                    category: category || null,
                    brand: brand || null
                },
                correlationId
            })
        };

    } catch (error) {
        console.error('Error listing products:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'An error occurred while listing products',
                    correlationId
                }
            })
        };
    }
};
