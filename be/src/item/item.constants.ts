export const stableDiffusionUrl = 'http://127.0.0.1:7860/sdapi/v1/txt2img'

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

export const structure = {
    core: Object.values(ItemCoreType),
    tags: itemCoreTags,
}