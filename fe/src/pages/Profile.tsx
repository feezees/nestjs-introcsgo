import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

export default function Profile() {
    const { id } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGetProfile = async () => {
        setProfile(null);
        setError(null);

        api.get(`/profile/${id}`)
            .then(response => setProfile(response.data))
            .catch(error => {
                console.error("Error fetching profile:", error);
                setError(error.response.data.message);
            });
    }

    const handleAiUpdate = () => {
        // api
        api.post(`/profile/${id}/ai-update-nickname/${profile.nickname}`)
            .then(() => {
                handleGetProfile();
            })
            .catch(error => {
                console.error("Error updating profile:", error);
            })
    }

    useEffect(() => {
        // api
        if (!id) {
            return;
        }

        handleGetProfile();
    }, [id]);

    return (
        <div className="flex flex-col p-4">
            {error && (
                <div>
                    <p>{error}</p>
                </div>
            )}
            {!error && profile && (
                <div>
                    <h1>Profile</h1>
                    {Object.entries(profile).map(([key, value]) => (
                        <div key={key}>

                            <p>{key}: {JSON.stringify(value)} {key === 'nickname' ? <button className="cursor-pointer bg-blue-500 text-white px-2 rounded-md" onClick={handleAiUpdate}>ai update</button> : null} </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}