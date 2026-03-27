import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber } from "class-validator";

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
}