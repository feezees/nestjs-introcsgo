import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Body } from "@nestjs/common";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        console.log(createUserDto);
        return this.usersService.create(createUserDto);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.usersService.delete(id);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}