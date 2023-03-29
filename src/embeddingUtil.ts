import { getOpenaiApi } from './util';

async function getEmbedding(text: string, engine="text-embedding-ada-002"): Promise<number[]> {
  text = text.replace("\n", " ")
  const embedding = await getOpenaiApi().createEmbedding({
    model: engine,
    input: text,
  });
  return embedding.data.data[0].embedding;
}

export {
  getEmbedding,
}