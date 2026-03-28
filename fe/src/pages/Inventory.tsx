import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";

export default function Inventory() {
    const { id } = useParams();
    const [inventory, setInventory] = useState<any>(null);
    useEffect(() => {
        // api
        api.get(`/inventory/${id}`)
            .then(response => setInventory(response.data))
            .catch(error => {
                console.error("Error fetching inventory:", error);
                setInventory(null); // Сбросить инвентарь при ошибке
            });
    }, [id]);

    return (
        <div>
            {!inventory && (
                <div>
                    <p>Inventory not found</p>
                </div>
            )}
            {inventory && (
                <div className="flex flex-wrap gap-2">
                    <h1>Inventory</h1>

                    {inventory.itemIds.map((itemId: number) => (
                        <div key={itemId}>
                            <p>Item ID: {itemId}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}