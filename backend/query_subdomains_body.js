const https = require('https');

function getBody(urlStr) {
    return new Promise((resolve) => {
        https.get(urlStr, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`URL: ${urlStr}`);
                console.log(`Status: ${res.statusCode}`);
                console.log(`Body: ${data}\n`);
                resolve();
            });
        }).on('error', (e) => {
            console.log(`URL: ${urlStr} failed: ${e.message}\n`);
            resolve();
        });
    });
}

async function run() {
    await getBody("https://criptana360-api.sandro.workers.dev/");
    await getBody("https://criptana360-api.luze.workers.dev/");
}

run();
