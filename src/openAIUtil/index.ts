import { ChatCompletionRequestMessage, CreateEmbeddingResponseDataInner } from 'openai';
import { Configuration, OpenAIApi } from 'openai';  
import { DEFAULT_CHAT_COMPLETION_MODEL } from '../const';
import { CreateChatCompletionResponse } from 'openai';

function getOpenaiApi() {
  if (!process.env.OPENAI_API_KEY) {
    console.log('no OPENAI_API_KEY provided');
  }
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    basePath: 'https://api.openai.com/v1',
  });
  const openai = new OpenAIApi(configuration);
  return openai;
}

const openaiApi = getOpenaiApi();

export const parseOpenAIStream = (chatResponse: CreateChatCompletionResponse, callback: (token: string) => any) => {
  return new Promise((resolve) => {
    let result = "";
    // @ts-ignore
    chatResponse.on("data", (data) => {
        const lines = data
            ?.toString()
            ?.split("\n")
            .filter((line: string) => line.trim() !== "");
            
        for (const line of lines) {
            const message = line.replace(/^data: /, "");
            if (message == "[DONE]") {
                resolve(result);
            } else {
                let token: string;
                try {
                    token = JSON.parse(message)?.choices[0].delta?.content || ''
                } catch(error) {
                    console.log("error", error);
                }

                result += token;
                
                if (token) {
                    callback(token);
                }
            }
        }
    });
  });
}

async function getEmbedding(texts: string[], model: string): Promise<CreateEmbeddingResponseDataInner[] | undefined> {
  texts = texts.map(text => text.replace("\n", " "));
  try {
    const embedding = await openaiApi.createEmbedding({
      model,
      input: texts,
    });
    return embedding.data.data;
  } catch (error) {
    console.log('createEmbeddingError', error);
  }
}

async function chat(messages: Array<ChatCompletionRequestMessage>, model: string = DEFAULT_CHAT_COMPLETION_MODEL) {
  return (await openaiApi.createChatCompletion({model, messages, stream: true}, {responseType: 'stream'})).data;
}

async function completion(prompt: string, model: string = DEFAULT_CHAT_COMPLETION_MODEL) {
  
}

export {
  getEmbedding,
  completion,
  chat,
  openaiApi,
}