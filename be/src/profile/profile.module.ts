import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
    imports: [UsersModule],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule {}   