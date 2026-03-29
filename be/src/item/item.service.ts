import { BadRequestException, Injectable } from "@nestjs/common";

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

export const itemCoreTags = [
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

@Injectable()
export class ItemService {
    getStructure() {
        return {
            core: Object.values(ItemCoreType),
            tags: itemCoreTags,
        }
    }

    validateStructure(coreType: ItemCoreType, tags: string[]) {
        const validateTags = itemCoreTags.filter(tag => !Object.values(ItemCoreType).includes(tag as ItemCoreType));

        if (validateTags.length < 1) {
            throw new BadRequestException('Invalid tags');
        }

        const validatedCore = Object.values(ItemCoreType).includes(coreType as ItemCoreType);
        if (!validatedCore) {
            throw new BadRequestException('Invalid tags or core type');
        }

        return true;
    }

    async generateImage(coreType: ItemCoreType, tags: string[]): Promise<string> {
        const safetyPromptReq = `csgo game weapon skin ${coreType} ${tags.join(' ')}`;

        try {
            const sdResponse = await fetch(stableDiffusionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: safetyPromptReq,
                    model: "cyberrealisticFlux_v25.safetensors [0d60068351]",
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
        }
        catch (error) {
            console.error(error);
            throw new BadRequestException('Failed to generate image');
        }
    }
}
