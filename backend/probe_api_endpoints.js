const https = require('https');

const subdomains = ['sandro', 'luze', 'zevallos', 'zeval', 'llsandrozll', 'criptana360'];

function probeEndpoint(sub, endpoint) {
    return new Promise((resolve) => {
        const urlStr = `https://criptana360-api.${sub}.workers.dev${endpoint}`;
        const url = new URL(urlStr);
        
        console.log(`Probing: ${urlStr}`);
        
        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname,
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://www.criptana360.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'content-type'
            }
        };

        const req = https.request(options, (res) => {
            console.log(`   ➜ ${sub} ${endpoint}: OPTIONS Status = ${res.statusCode}`);
            console.log(`     Headers: ${JSON.stringify(res.headers, null, 2)}`);
            resolve({ sub, endpoint, status: res.statusCode, headers: res.headers });
        });

        req.on('error', (err) => {
            console.log(`   ➜ ${sub} ${endpoint}: Failed (${err.code || err.message})`);
            resolve({ sub, endpoint, failed: true });
        });

        req.setTimeout(4000, () => {
            req.destroy();
            console.log(`   ➜ ${sub} ${endpoint}: Timeout`);
            resolve({ sub, endpoint, timeout: true });
        });
        
        req.end();
    });
}

async function run() {
    console.log("=== 🔍 Detailed Workers Endpoint Probing ===\n");
    for (const sub of subdomains) {
        await probeEndpoint(sub, '/api/subscribe');
        console.log("");
    }
    console.log("=== 🏁 Probing Completed ===");
}

run();
