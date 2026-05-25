const https = require('https');
const fs = require('fs');
const path = require('path');

// Manually parse .env file to avoid external dependency
const envPath = path.join(__dirname, '.env');
let apiToken = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/CLOUDFLARE_API_TOKEN=(.*)/);
    if (match && match[1]) {
        apiToken = match[1].trim();
    }
}

if (!apiToken) {
    console.error("❌ ERROR: CLOUDFLARE_API_TOKEN not found in .env file.");
    process.exit(1);
}

const DOMAIN_NAME = "criptana360.com";
const TARGET_CNAME = "llsandrozll.github.io";
const TARGET_IPS = [
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153"
];

// Helper to make https requests to Cloudflare API
function makeRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.cloudflare.com',
            port: 443,
            path: `/client/v4${endpoint}`,
            method: method,
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(parsed);
                    }
                } catch (e) {
                    reject({ errors: [{ message: "Invalid JSON response from Cloudflare" }] });
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function configureDNS() {
    console.log(`\n=== 🤖 Autonomous Cloudflare Setup: ${DOMAIN_NAME} ===`);
    
    try {
        // Step 1: Fetch Zone ID
        console.log(`\n🔍 Step 1: Querying Cloudflare for Zone ID for ${DOMAIN_NAME}...`);
        const zonesResult = await makeRequest('GET', `/zones?name=${DOMAIN_NAME}`);
        
        if (!zonesResult.result || zonesResult.result.length === 0) {
            throw new Error(`Domain ${DOMAIN_NAME} was not found in your Cloudflare account. Please verify domain name or Token permissions.`);
        }
        
        const zoneId = zonesResult.result[0].id;
        console.log(`   ✔ Success! Zone ID retrieved: ${zoneId}`);
        
        // Step 2: Delete any pre-existing default root A or CNAME records to avoid conflicts
        console.log(`\n🧹 Step 2: Checking for existing default DNS records...`);
        const existingRecords = await makeRequest('GET', `/zones/${zoneId}/dns_records`);
        for (const record of existingRecords.result) {
            if ((record.type === 'A' && record.name === DOMAIN_NAME) || 
                (record.type === 'CNAME' && record.name === `www.${DOMAIN_NAME}`)) {
                console.log(`   - Deleting conflicting default ${record.type} record (${record.content})...`);
                await makeRequest('DELETE', `/zones/${zoneId}/dns_records/${record.id}`);
            }
        }
        console.log("   ✔ Existing DNS conflicts cleared successfully.");

        // Step 3: Inject the 4 A records
        console.log(`\n⚙ Step 3: Injecting 4 root A records pointing to GitHub Pages...`);
        for (const ip of TARGET_IPS) {
            const payload = {
                type: 'A',
                name: '@',
                content: ip,
                ttl: 1, // Automatic
                proxied: false // DNS Only is required for initial SSL handshake on GitHub
            };
            await makeRequest('POST', `/zones/${zoneId}/dns_records`, payload);
            console.log(`   ✔ Created A Record: @ ➜ ${ip}`);
        }

        // Step 4: Inject CNAME record for www
        console.log(`\n⚙ Step 4: Injecting CNAME record for www subdomain...`);
        const cnamePayload = {
            type: 'CNAME',
            name: 'www',
            content: TARGET_CNAME,
            ttl: 1,
            proxied: false
        };
        await makeRequest('POST', `/zones/${zoneId}/dns_records`, cnamePayload);
        console.log(`   ✔ Created CNAME Record: www ➜ ${TARGET_CNAME}`);

        console.log("\n=======================================================");
        console.log("🎉 SUCCESS! Criptana360.com DNS configured successfully.");
        console.log("👉 Your domain is now programmatically linked to your website.");
        console.log("=======================================================");

    } catch (error) {
        console.error("\n❌ ERROR: Cloudflare DNS Configuration Failed!");
        if (error.errors) {
            error.errors.forEach(err => console.error(`  - Code ${err.code}: ${err.message}`));
        } else {
            console.error(`  - ${error.message}`);
        }
        process.exit(1);
    }
}

configureDNS();
