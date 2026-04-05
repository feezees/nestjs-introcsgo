import { Injectable } from "@nestjs/common";
import ollama from 'ollama';

@Injectable()
export class ChatService {
    constructor() { }

    async *getOllamaStream(prompt: string) {
        const response = await ollama.chat({
            model: "llama3.1",
            messages: [{
                role: 'user',
                content: prompt
            }],
            stream: true
        });

        for await (const chunk of response) {
            yield chunk.message.content;
        }
    }
}