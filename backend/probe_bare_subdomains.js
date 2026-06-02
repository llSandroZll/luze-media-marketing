const https = require('https');

const subdomains = ['sandro', 'luze', 'zevallos', 'zeval', 'llsandrozll', 'criptana360', 'luzemediamarketing'];

function probeBare(sub) {
    return new Promise((resolve) => {
        const urlStr = `https://${sub}.workers.dev/`;
        
        const req = https.get(urlStr, (res) => {
            console.log(`   ➜ ${sub}: Status = ${res.statusCode}`);
            res.on('data', () => {});
            resolve();
        });

        req.on('error', (err) => {
            console.log(`   ➜ ${sub}: Failed (${err.code || err.message})`);
            resolve();
        });

        req.setTimeout(4000, () => {
            req.destroy();
            console.log(`   ➜ ${sub}: Timeout`);
            resolve();
        });
    });
}

async function run() {
    console.log("=== 🔍 Bare Subdomain Probing ===\n");
    for (const sub of subdomains) {
        await probeBare(sub);
    }
    console.log("\n=== 🏁 Probing Completed ===");
}

run();
