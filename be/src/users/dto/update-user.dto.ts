import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserDto {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    nickname: string;
    @Field(() => Number, { nullable: true })
    @IsNumber()
    steamId?: number;
}