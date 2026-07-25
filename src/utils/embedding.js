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
    throw new Error(`Groq embedding error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}


module.exports = { getEmbedding };