const OWNER = 'cherishXie';
const REPO = 'JX3-AH-Calculator';
const WORKFLOW = 'update-jx3-prices.yml';

async function triggerPriceUpdate(env) {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'jx3-price-cloud-cron',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref: 'main' })
    }
  );

  if (!response.ok) {
    const body = await response.text();
    console.error('GitHub dispatch failed', response.status, body);
    throw new Error(`GitHub dispatch failed: ${response.status}`);
  }
  console.log('GitHub workflow_dispatch sent');
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(triggerPriceUpdate(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/trigger') {
      const key = request.headers.get('x-trigger-key') || '';
      if (!env.TRIGGER_KEY || key !== env.TRIGGER_KEY) {
        return new Response('forbidden', { status: 403 });
      }
      await triggerPriceUpdate(env);
      return new Response('triggered', { status: 200 });
    }
    return new Response('jx3 price cloud cron', { status: 200 });
  }
};
