import { CreateEmbeddingResponseDataInner } from 'openai';
import { getOpenaiApi } from './util';

async function getEmbedding(texts: string[], engine="text-embedding-ada-002"): Promise<CreateEmbeddingResponseDataInner[] | undefined> {
  texts = texts.map(text => text.replace("\n", " "));
  try {
    const embedding = await getOpenaiApi().createEmbedding({
      model: engine,
      input: texts,
    });
    return embedding.data.data;
  } catch (error) {
    console.log('createEmbeddingError', error);
  }
}

export {
  getEmbedding,
}