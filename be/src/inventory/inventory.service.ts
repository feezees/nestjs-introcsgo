import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inventory } from "./inventory.entity";

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
    ) {}

    async getInventory(id: number): Promise<any> {
        const inventoryEntity = await this.inventoryRepository.findOne({ where: { id } });
        if (!inventoryEntity) {
            throw new NotFoundException(`Inventory with ID ${id} not found`);
        }
        return {
            id: inventoryEntity.id,
            itemIds: inventoryEntity.itemIds,
        };
    }
}