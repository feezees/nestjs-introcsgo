import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { Reflector } from '@nestjs/core';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersResolver, Reflector],
    exports: [UsersService],
})
export class UsersModule {}