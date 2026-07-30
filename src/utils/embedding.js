require("dotenv").config();

async function getEmbedding(text) {
  const response = await fetch('https://api.groq.com/openai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'nomic-embed-text-v1_5',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`Groq embedding warning: ${response.status} ${errText}. Using fallback embeddings.`);
    return Array(1536).fill(0.1);
  }

  const data = await response.json();
  return data.data[0].embedding;
}


module.exports = { getEmbedding };