import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber } from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @Column({ nullable: true })
    @IsNumber()
    steamId?: number;
}