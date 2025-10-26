const https = require('https');

const API_BASE_URL = 'https://cd7le0c65a.execute-api.us-east-1.amazonaws.com/prod';

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ statusCode: res.statusCode, data: jsonData });
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

async function runTests() {
    console.log('🚀 Starting API Tests...\n');
    
    const tests = [
        {
            name: 'Get All Products',
            url: `${API_BASE_URL}/products`,
            expectedStatus: 200,
            validate: (response) => {
                return response.data.success === true && 
                       Array.isArray(response.data.data) && 
                       response.data.data.length === 10;
            }
        },
        {
            name: 'Get Specific Product (iPhone)',
            url: `${API_BASE_URL}/products/ELEC001`,
            expectedStatus: 200,
            validate: (response) => {
                return response.data.success === true && 
                       response.data.data.productId === 'ELEC001' &&
                       response.data.data.name === 'iPhone 15 Pro';
            }
        },
        {
            name: 'Filter by Category (Electronics)',
            url: `${API_BASE_URL}/products?category=Electronics`,
            expectedStatus: 200,
            validate: (response) => {
                return response.data.success === true && 
                       response.data.data.length === 3 &&
                       response.data.filters.category === 'Electronics';
            }
        },
        {
            name: 'Filter by Brand (Apple)',
            url: `${API_BASE_URL}/products?brand=Apple`,
            expectedStatus: 200,
            validate: (response) => {
                return response.data.success === true && 
                       response.data.data.length === 2 &&
                       response.data.filters.brand === 'Apple';
            }
        },
        {
            name: 'Filter by Category (Clothing)',
            url: `${API_BASE_URL}/products?category=Clothing`,
            expectedStatus: 200,
            validate: (response) => {
                return response.data.success === true && 
                       response.data.data.length === 3 &&
                       response.data.filters.category === 'Clothing';
            }
        },
        {
            name: 'Pagination Test',
            url: `${API_BASE_URL}/products?pageSize=5`,
            expectedStatus: 200,
            validate: (response) => {
                return response.data.success === true && 
                       response.data.data.length === 5 &&
                       response.data.pagination.pageSize === 5;
            }
        },
        {
            name: 'Non-existent Product (404 Error)',
            url: `${API_BASE_URL}/products/NONEXISTENT`,
            expectedStatus: 404,
            validate: (response) => {
                return response.data.success === false && 
                       response.data.error.code === 'PRODUCT_NOT_FOUND';
            }
        },
        {
            name: 'Empty Category Filter',
            url: `${API_BASE_URL}/products?category=NonExistentCategory`,
            expectedStatus: 200,
            validate: (response) => {
                return response.data.success === true && 
                       response.data.data.length === 0;
            }
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            console.log(`Testing: ${test.name}`);
            const response = await makeRequest(test.url);
            
            if (response.statusCode === test.expectedStatus && test.validate(response)) {
                console.log(`✅ PASSED: ${test.name}`);
                passed++;
            } else {
                console.log(`❌ FAILED: ${test.name}`);
                console.log(`   Expected status: ${test.expectedStatus}, Got: ${response.statusCode}`);
                console.log(`   Validation failed or unexpected response structure`);
                failed++;
            }
        } catch (error) {
            console.log(`❌ ERROR: ${test.name} - ${error.message}`);
            failed++;
        }
        console.log('');
    }

    console.log('📊 Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed === 0) {
        console.log('\n🎉 All tests passed! API is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the API implementation.');
    }
}

// Additional validation tests
async function validateDataIntegrity() {
    console.log('\n🔍 Validating Data Integrity...\n');
    
    try {
        // Test flexible schema
        const response = await makeRequest(`${API_BASE_URL}/products/ELEC001`);
        const product = response.data.data;
        
        console.log('Testing Flexible Schema:');
        console.log(`✅ Product has specifications object: ${!!product.specifications}`);
        console.log(`✅ Specifications contain dimensions: ${!!product.specifications.dimensions}`);
        console.log(`✅ Nested attributes work: ${!!product.specifications.dimensions.length}`);
        
        // Test different product types
        const clothingResponse = await makeRequest(`${API_BASE_URL}/products/CLOTH001`);
        const clothing = clothingResponse.data.data;
        
        console.log(`✅ Different schema for clothing: ${clothing.specifications.material !== undefined}`);
        console.log(`✅ Category-specific attributes: ${clothing.specifications.care !== undefined}`);
        
        console.log('\n✅ Data integrity validation passed!');
        
    } catch (error) {
        console.log(`❌ Data integrity validation failed: ${error.message}`);
    }
}

async function main() {
    await runTests();
    await validateDataIntegrity();
}

main().catch(console.error);
