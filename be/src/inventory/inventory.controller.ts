import { Controller, Get, Param } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Get(':id')
    async getInventory(@Param('id') id: number): Promise<any> {
        const inventoryEntity = await this.inventoryService.getInventory(id);
        return {
            id: inventoryEntity.id,
            itemIds: inventoryEntity.itemIds,
        };
    }
}