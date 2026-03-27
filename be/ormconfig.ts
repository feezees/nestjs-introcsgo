import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { AddUserRole1678886400000 } from './src/migrations/1678886400000-AddUserRole';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [User],
    migrations: [AddUserRole1678886400000],
});