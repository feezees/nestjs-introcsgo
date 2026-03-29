import { ItemController } from "./item.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "./item.entity";
import { Module } from "@nestjs/common";
import { ItemService } from "./item.service";

@Module({
    imports: [],
    controllers: [ItemController],
    providers: [ItemService],
})
export class ItemModule {}