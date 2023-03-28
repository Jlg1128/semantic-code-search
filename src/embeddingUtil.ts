import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getEmbedding(text: string, engine="text-embedding-ada-002"): Promise<number[]> {
  text = text.replace("\n", " ")
  const embedding = await openai.createEmbedding({
    model: engine,
    input: text,
  });
  return embedding.data.data[0].embedding;
}

export {
  getEmbedding,
}