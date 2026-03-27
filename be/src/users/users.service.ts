import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        
        if (!updateUserDto.nickname) {
            throw new HttpException('Nickname is required', HttpStatus.BAD_REQUEST);
        }

        return this.userRepository.save({ id, ...updateUserDto });
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { steamId: createUserDto.steamId } });

        if (user) {
            throw new HttpException('User with this steamid already exists', HttpStatus.CONFLICT);
        }

        // create new user
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}