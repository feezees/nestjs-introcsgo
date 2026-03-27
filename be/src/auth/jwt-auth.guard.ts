import {
    ExecutionContext,
    Injectable,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    getRequest(context: ExecutionContext): Request {
        const type = context.getType<string>();
        if (type === "graphql") {
            const ctx = GqlExecutionContext.create(context);
            return ctx.getContext().req;
        }
        return context.switchToHttp().getRequest();
    }
}
