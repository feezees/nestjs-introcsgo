import { BadRequestException, Body, Controller, Get } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { ItemCoreType, ItemService } from "./item.service";

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Get('ai-generate-prompt')
    async getAiGeneratePrompt() {
        return this.itemService.getStructure();
    }

    @Post('ai-generate-image')
    async getItem(@Body('coreType') coreType: ItemCoreType, @Body('tags') tags: string[]) {
        const isValid = this.itemService.validateStructure(coreType, tags);
        if (!isValid) {
            throw new BadRequestException('Invalid tags or core type');
        }

        const image = await this.itemService.generateImage(coreType, tags);
        return image;
    }
}