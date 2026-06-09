import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    event.respondWith(new Response('Internal Error', { status: 500 }));
  }
});

async function handleEvent(event) {
  const url = new URL(event.request.url);
  let options = {};
  
  try {
    const page = await getAssetFromKV(event, options);
    // Allow response headers to be set
    const response = new Response(page.body, page);
    return response;
  } catch (e) {
    try {
      let notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
      });
      return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 });
    } catch (e2) {
      return new Response('Not Found', { status: 404 });
    }
  }
}
