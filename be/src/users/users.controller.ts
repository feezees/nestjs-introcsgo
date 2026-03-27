import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Put(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

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