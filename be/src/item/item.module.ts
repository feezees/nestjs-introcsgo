import { ItemController } from "./item.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "./item.entity";
import { Module } from "@nestjs/common";

@Module({
    imports: [],
    controllers: [ItemController],
    providers: [],
})
export class ItemModule {}