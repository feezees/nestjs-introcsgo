import { Item } from "src/item/item.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/user.entity";

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'simple-json' })
    itemIds: Item['id'][];

    @OneToOne(() => User, (user) => user.inventory)
    user: User;
}