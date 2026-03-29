import { BadRequestException, Body, Controller, Get } from "@nestjs/common";
import { Item } from "./item.entity";
import { Post } from "@nestjs/common";

const stableDiffusionUrl = 'http://127.0.0.1:7860/sdapi/v1/txt2img'

export enum ItemCoreType {
    AWP = 'awp',
    PISTOL = 'pistol',
    RIFLE = 'rifle',
    SMG = 'smg',
    SHOTGUN = 'shotgun',
    SNIPER = 'sniper',
    KNIFE = 'knife',
    GLOVES = 'gloves'
}

@Controller('item')
export class ItemController {
    @Get('ai-generate-prompt')
    async getAiGeneratePrompt() {
        return {
            core: Object.values(ItemCoreType),
            tags: [
                'weapon',
                'skin',
                'cyberpunk',
                'futuristic',
                'metal',
                'industrial',
                'steampunk',
                // colors
                'red',
                'blue',
                'green',
                'yellow',
                'purple',
                'orange',
                'brown',
                'black',
                'white',
            ]
        }
    }

    @Post('ai-generate-image')
    async getItem(@Body('coreType') coreType: ItemCoreType, @Body('tags') tags: string[]) {

        // validate tags
        const validateTags = tags.filter(tag => !Object.values(ItemCoreType).includes(tag as ItemCoreType));

        if (validateTags.length < 1) {
            throw new BadRequestException('Invalid tags');
        }

        const validatedCore = Object.values(ItemCoreType).includes(coreType as ItemCoreType);
        if (!validatedCore) {
            throw new BadRequestException('Invalid tags or core type');
        }

        const safetyPromptReq = `csgo game weapon skin ${coreType} ${tags.join(' ')}`;

        console.log(safetyPromptReq);

        const sdResponse = await fetch(stableDiffusionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: safetyPromptReq,
                negative_prompt: "blurry, low quality",
                steps: 20,
                sampler_name: "Euler a",
                cfg_scale: 7,
                width: 512,
                height: 512,
                seed: -1
            })
        })

        const sdResponseJson = await sdResponse.json();
        return sdResponseJson.images[0];

        // if (!Object.values(ItemCoreType).includes(coreType)) {
        //     throw new BadRequestException('Invalid core type');
        // }

        // const safetyPromptReq = `awp weapon skin`
        // const response = await fetch(stableDiffusionUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         model: "cyberrealisticFlux_v25.safetensors [0d60068351]",
        //         prompt: safetyPromptReq,
        //         steps: 20,
        //         sampler_name: "Euler a",
        //         cfg_scale: 7,
        //         width: 512,
        //         height: 512,
        //         seed: -1
        //     }),
        // });
        // const responseJson = await response.json();
        // console.log(responseJson);
        // return responseJson;

        return true;
    }
}