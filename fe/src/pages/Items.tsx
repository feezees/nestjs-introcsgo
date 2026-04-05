import { useEffect, useState } from "react";
import { api } from "../api/client";



export default function Items() {
    const [tags, setTags] = useState<string[]>([]);
    const [core, setCore] = useState<string[]>([]);
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [activeCore, setActiveCore] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');

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

    const createItem = () => {
        console.log(title, image);
        return;
        api.post('/item/create', {
            title: title,
            image: image,
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error(error);
        });
    }

    const submitDisabled = !title || !image;

    return (
        <div className="flex flex-col justify-center gap-2" >
            <input className="w-1/2 p-2 border-2 border-gray-500 rounded-md bg-black/40 text-white" placeholder="Title" type="text" value={title} onChange={e => setTitle(e.target.value)} />

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

            <button className="flex w-128 my-2 cursor-pointer bg-blue-500 text-white p-2 rounded-md" onClick={() => {
                generateImage();
            }}>Generate Image</button>

            <div className="flex flex-wrap gap-2 items-center justify-center h-128 w-128">
                {!loading && <img src={image ? image : 'https://placehold.co/400'} className="object-cover h-full w-full" alt="image" />}
                {loading && <p>Loading...</p>}
            </div>

            <button className="mt-2 w-128 cursor-pointer bg-blue-500 text-white p-2 rounded-md" onClick={() => {
                createItem();
            }} disabled={submitDisabled}>Create Item</button> 
        </div>
    )
}