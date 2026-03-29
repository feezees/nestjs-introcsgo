import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService, private readonly usersService: UsersService) { }

    @Post(':id/ai-update-nickname/:nickname')
    async aiUpdateNickname(@Req() req: Request, @Param('id') id: string, @Param('nickname') nickname: string): Promise<User | null> {
        // ?????
        const token = req.headers.authorization.split(' ')[1];
        const profile = await this.profileService.aiUpdateNickname(token, id, nickname);
        return profile;
    }

    @Get(':id')
    async getProfile(@Req() req: Request, @Param('id') id: string): Promise<User | null> {
        // ?????
        const token = req.headers.authorization.split(' ')[1];
        
        const profile = await this.profileService.getProfile(token, id);
        return profile;
    }
}