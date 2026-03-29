import { useEffect, useState } from "react";
import { api } from "../api/client";



export default function Items() {
    const [tags, setTags] = useState<string[]>([]);
    const [core, setCore] = useState<string[]>([]);
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [activeCore, setActiveCore] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        api.get('/item/ai-generate-prompt').then(response => {
            setTags(response.data.tags);
            setCore(response.data.core);
            setActiveCore(response.data.core[0]);
        });
    }, []);

    const handleToggleTag = (tag: string) => {
        if (activeTags.includes(tag)) {
            setActiveTags(activeTags.filter(t => t !== tag));
        } else {
            setActiveTags([...activeTags, tag]);
        }
    }

    const generateImage = () => {
        setLoading(true);
        
        api.post('/item/ai-generate-image', {
            coreType: activeCore,
            tags: activeTags,
        }).then(response => {
            setImage('data:image/png;base64,' + response.data);
            setLoading(false);
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <div >
            <h1>Items</h1>

            <div className="flex flex-wrap gap-2">
                {core.map(core => (
                    <button className="cursor-pointer" key={core} onClick={() => setActiveCore(core)}>
                        <p className={activeCore === core ? 'text-blue-500' : 'text-gray-500'}>{core}</p>
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <button className="cursor-pointer" key={tag} onClick={() => handleToggleTag(tag)}>
                        <p className={activeTags.includes(tag) ? 'text-blue-500' : 'text-gray-500'}>{tag}</p>
                    </button>
                ))}
            </div>

            <button onClick={() => {
                generateImage();
            }}>Generate Image</button>

            <div className="flex flex-wrap gap-2 items-center justify-center h-128 w-128">
                {!loading && <img src={image ? image : 'https://placehold.co/400'} className="object-cover h-full w-full" alt="image" />}
                {loading && <p>Loading...</p>}
            </div>
        </div>
    )
}