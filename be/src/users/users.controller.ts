import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { Body } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from './user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<any> {
        const userEntity = await this.usersService.update(id, updateUserDto);
        return {
            id: userEntity.id,
            nickname: userEntity.nickname,
            steamId: userEntity.steamId,
            role: userEntity.role,
            inventory: userEntity.inventory?.id,
        };
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<any> {
        const userEntity = await this.usersService.create(createUserDto);
        return {
            id: userEntity.id,
            nickname: userEntity.nickname,
            steamId: userEntity.steamId,
            role: userEntity.role,
            inventory: userEntity.inventory?.id,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.usersService.delete(id);
    }

    @Get()
    async findAll(): Promise<any[]> {
        const userEntities = await this.usersService.findAll();
        return userEntities.map(userEntity => ({
            id: userEntity.id,
            nickname: userEntity.nickname,
            steamId: userEntity.steamId,
            role: userEntity.role,
            inventory: userEntity.inventory?.id,
        }));
    }
}