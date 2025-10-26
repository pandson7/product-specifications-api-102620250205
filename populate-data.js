const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'ProductSpecifications-102620250205';

const sampleProducts = [
    // Electronics
    {
        productId: 'ELEC001',
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        brand: 'Apple',
        specifications: {
            color: 'Space Black',
            storage: '256GB',
            display: '6.1-inch Super Retina XDR',
            processor: 'A17 Pro chip',
            camera: '48MP Main camera',
            weight: '187g',
            dimensions: {
                length: 146.6,
                width: 70.6,
                height: 8.25
            }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'ELEC002',
        name: 'MacBook Pro 14-inch',
        category: 'Electronics',
        brand: 'Apple',
        specifications: {
            color: 'Space Gray',
            processor: 'M3 Pro chip',
            memory: '18GB unified memory',
            storage: '512GB SSD',
            display: '14.2-inch Liquid Retina XDR',
            weight: '1.6kg',
            batteryLife: 'Up to 18 hours',
            dimensions: {
                length: 312.6,
                width: 221.2,
                height: 15.5
            }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'ELEC003',
        name: 'Galaxy S24 Ultra',
        category: 'Electronics',
        brand: 'Samsung',
        specifications: {
            color: 'Titanium Black',
            storage: '512GB',
            display: '6.8-inch Dynamic AMOLED 2X',
            processor: 'Snapdragon 8 Gen 3',
            camera: '200MP Wide camera',
            weight: '232g',
            spen: true,
            dimensions: {
                length: 162.3,
                width: 79.0,
                height: 8.6
            }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    
    // Clothing
    {
        productId: 'CLOTH001',
        name: 'Classic Cotton T-Shirt',
        category: 'Clothing',
        brand: 'Nike',
        specifications: {
            color: 'Navy Blue',
            size: 'Large',
            material: '100% Cotton',
            fit: 'Regular',
            care: 'Machine wash cold',
            weight: '180g',
            origin: 'Vietnam'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'CLOTH002',
        name: 'Denim Jeans',
        category: 'Clothing',
        brand: 'Levi\'s',
        specifications: {
            color: 'Dark Blue',
            size: '32x34',
            material: '98% Cotton, 2% Elastane',
            fit: 'Slim',
            style: '511',
            weight: '450g',
            origin: 'Mexico'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'CLOTH003',
        name: 'Running Shoes',
        category: 'Clothing',
        brand: 'Adidas',
        specifications: {
            color: 'White/Black',
            size: '10.5 US',
            material: 'Mesh upper with rubber sole',
            technology: 'Boost midsole',
            weight: '320g',
            purpose: 'Running',
            origin: 'Vietnam'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    
    // Home & Garden
    {
        productId: 'HOME001',
        name: 'Coffee Maker',
        category: 'Home & Garden',
        brand: 'Keurig',
        specifications: {
            color: 'Black',
            capacity: '12 cups',
            type: 'Drip coffee maker',
            features: ['Programmable', 'Auto shut-off', 'Pause & serve'],
            power: '900W',
            weight: '3.2kg',
            dimensions: {
                length: 350,
                width: 180,
                height: 330
            }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'HOME002',
        name: 'Dining Table',
        category: 'Home & Garden',
        brand: 'IKEA',
        specifications: {
            color: 'Oak',
            material: 'Solid wood',
            seating: '6 people',
            shape: 'Rectangular',
            weight: '45kg',
            assembly: 'Required',
            dimensions: {
                length: 180,
                width: 90,
                height: 75
            }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    
    // Sports & Outdoors
    {
        productId: 'SPORT001',
        name: 'Mountain Bike',
        category: 'Sports & Outdoors',
        brand: 'Trek',
        specifications: {
            color: 'Red',
            frameSize: 'Large',
            material: 'Aluminum',
            gears: '21-speed',
            wheelSize: '29 inch',
            suspension: 'Front suspension',
            weight: '14.5kg',
            brakes: 'Disc brakes'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'SPORT002',
        name: 'Yoga Mat',
        category: 'Sports & Outdoors',
        brand: 'Manduka',
        specifications: {
            color: 'Purple',
            material: 'Natural rubber',
            thickness: '6mm',
            length: '183cm',
            width: '61cm',
            weight: '2.5kg',
            texture: 'Non-slip surface',
            ecoFriendly: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

async function populateData() {
    console.log('Starting to populate sample data...');
    
    try {
        for (const product of sampleProducts) {
            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: product
            });
            
            await docClient.send(command);
            console.log(`✓ Added product: ${product.name} (${product.productId})`);
        }
        
        console.log(`\n✅ Successfully populated ${sampleProducts.length} products!`);
        console.log('\nSample products by category:');
        
        const categories = [...new Set(sampleProducts.map(p => p.category))];
        categories.forEach(category => {
            const count = sampleProducts.filter(p => p.category === category).length;
            console.log(`  - ${category}: ${count} products`);
        });
        
        console.log('\nSample products by brand:');
        const brands = [...new Set(sampleProducts.map(p => p.brand))];
        brands.forEach(brand => {
            const count = sampleProducts.filter(p => p.brand === brand).length;
            console.log(`  - ${brand}: ${count} products`);
        });
        
    } catch (error) {
        console.error('Error populating data:', error);
        process.exit(1);
    }
}

populateData();
