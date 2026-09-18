// lib/ai/huggingface.ts
export async function analyzeWithHuggingFace(text: string): Promise<string[]> {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`, // Gratuit
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: [
            'produits-agricoles',
            'fruits-legumes',
            'betail-volaille',
            'semences-plants',
            'intrants',
            'equipements',
            'immobilier',
            'produits-transformes',
            'peche',
            'services',
          ],
        },
      }),
    }
  );

  const data = await response.json();
  return data.labels || [];
}