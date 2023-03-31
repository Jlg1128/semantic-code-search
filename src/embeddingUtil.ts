import { getOpenaiApi } from './util';

async function getEmbedding(text: string, engine="text-embedding-ada-002"): Promise<number[] | undefined> {
  text = text.replace("\n", " ")
  try {
    const embedding = await getOpenaiApi().createEmbedding({
      model: engine,
      input: text,
    });
    return embedding.data.data[0].embedding;
  } catch (error) {
    console.log('createEmbeddingError', error);
  }
}

export {
  getEmbedding,
}