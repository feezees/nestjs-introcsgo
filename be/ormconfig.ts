import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Inventory } from './src/inventory/inventory.entity';
import { AddUserRole1678886400000 } from './src/migrations/1678886400000-AddUserRole';
import { RemoveSteamIdFromInventory1774659271194 } from './src/migrations/1774659271194-RemoveSteamIdFromInventory';
export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [User, Inventory],
    migrations: [AddUserRole1678886400000, RemoveSteamIdFromInventory1774659271194],
});