import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber } from "class-validator";
import { Inventory } from "src/inventory/inventory.entity";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @Column({ nullable: true })
    @IsNumber()
    steamId?: number;

    @Column({ nullable: true, select: false })
    passwordHash?: string;

    @Column({
        type: 'varchar',
        default: UserRole.USER,
    })
    role: UserRole;

    @Column({ unique: true })
    inventoryId: number;

    @OneToOne(() => Inventory, { eager: true })
    @JoinColumn({ name: 'inventoryId', referencedColumnName: 'id' })
    inventory: Inventory;
}