const https = require('https');

function postJSON(urlStr, data) {
    return new Promise((resolve, reject) => {
        const url = new URL(urlStr);
        const postData = JSON.stringify(data);

        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function run() {
    console.log("=== 🔍 Testing Deployed Custom Domain Route ===");
    try {
        const payload = { email: "live-deploy-test@example.com", lang: "es" };
        const res = await postJSON("https://www.criptana360.com/api/subscribe", payload);
        console.log(`Status: ${res.status}`);
        console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
        console.log(`Body: ${res.body}`);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

run();
