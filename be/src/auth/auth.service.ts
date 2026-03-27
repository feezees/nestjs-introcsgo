import {
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { UserRole } from '../users/user.entity';
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const user = await this.usersService.registerWithPassword(
            dto.nickname,
            dto.password,
            dto.steamId,
            dto.role || UserRole.USER,
        );
        return this.issueTokens(user.id, user.nickname, user.role);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByNicknameForAuth(
            dto.nickname,
        );
        if (!user?.passwordHash) {
            throw new UnauthorizedException("Invalid credentials");
        }
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) {
            throw new UnauthorizedException("Invalid credentials");
        }
        return this.issueTokens(user.id, user.nickname, user.role);
    }

    private issueTokens(userId: number, nickname: string, role: UserRole) {
        const payload = { sub: userId, nickname, role };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: userId, nickname, role },
        };
    }
}
