// lib/ai/cloudflare.ts
export async function analyzeWithCloudflare(text: string): Promise<string> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/facebook/bart-large-mnli`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        labels: ['agricole', 'élevage', 'équipement', 'service'],
      }),
    }
  );

  const data = await response.json();
  return data.result?.labels?.[0] || '';
}