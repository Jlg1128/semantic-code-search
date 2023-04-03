import { CreateChatCompletionResponse } from 'openai';

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