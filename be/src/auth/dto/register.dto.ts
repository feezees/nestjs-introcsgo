import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    steamId?: number;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
