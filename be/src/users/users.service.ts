import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User, UserRole } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "src/auth/auth.constants";
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

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async findByNicknameForAuth(nickname: string): Promise<User | null> {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.passwordHash')
            .where('user.nickname = :nickname', { nickname })
            .getOne();
    }

    async registerWithPassword(
        nickname: string,
        plainPassword: string,
        steamId?: number,
        role: UserRole = UserRole.USER,
    ): Promise<User> {
        const existing = await this.userRepository.findOne({
            where: { nickname },
        });
        if (existing) {
            throw new HttpException('Nickname already taken', HttpStatus.CONFLICT);
        }
        if (steamId !== undefined) {
            const bySteam = await this.userRepository.findOne({
                where: { steamId },
            });
            if (bySteam) {
                throw new HttpException(
                    'User with this steamid already exists',
                    HttpStatus.CONFLICT,
                );
            }
        }
        const passwordHash = await bcrypt.hash(plainPassword, 10);
        const user = this.userRepository.create({
            nickname,
            steamId,
            passwordHash,
            role,
        });
        return this.userRepository.save(user);
    }

    async isOwner(token:string, userId: number): Promise<boolean> {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        console.log(decoded.sub);
        console.log(userId);
        
        return +decoded.sub === +userId.toString();
    }
}