import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ProfileService {
    constructor(private readonly usersService: UsersService) { }

    async aiUpdateNickname(token: string, userId: string, nickname: string): Promise<User | null> {
        const isOwner = await this.usersService.isOwner(token, Number(userId));
        if (!isOwner) {
            throw new UnauthorizedException("You are not the owner of this profile");
        }

        // call ai api to update nickname
        const aiResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama3.1",
                prompt: `My old nickname is ${nickname}. Please generate a new nickname for me. Response only string without 'here is new one', its very important. Everything broke if you add something but not nickname`,
                "stream": false

            }),
        });

        console.log('#52 aiResponse', aiResponse)

        if (!aiResponse?.ok) {
            throw new InternalServerErrorException(`AI API returned status ${aiResponse.status}`);
        }

        const aiResponseJson = await aiResponse.json();
        console.log('#52', aiResponseJson.response);

        if (typeof aiResponseJson.response !== 'string') {
            throw new BadRequestException("AI failed :( ");
        }

        const user = await this.usersService.update(Number(userId), { nickname: aiResponseJson.response });
        return user;
    }

    async getProfile(token: string, userId: string): Promise<User | null> {
   
        
        const isOwner = await this.usersService.isOwner(token, Number(userId));

        if (!isOwner) {
            throw new UnauthorizedException("You are not the owner of this profile");
        }
        const user = await this.usersService.findById(Number(userId));
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }
}