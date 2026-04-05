import { Controller, Get, Post, Sse, MessageEvent, Req } from "@nestjs/common";
import { Observable, interval, map, from } from "rxjs";
import type { Request } from 'express';
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Sse('stream')
    sse(@Req() req: Request): Observable<MessageEvent> {
        const prompt = req.query.prompt as string;
        return from(this.chatService.getOllamaStream(prompt)).pipe(
            map((chunk) => ({
                data: chunk,
            })),
        );
    }
}