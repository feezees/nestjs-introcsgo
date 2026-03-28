import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User as UserGQL } from './models/user.model';
import { User as UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver(() => UserGQL)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserGQL])
  async users(): Promise<UserGQL[]> {
    const userEntities = await this.usersService.findAll();
    return userEntities.map(userEntity => ({
        id: userEntity.id,
        nickname: userEntity.nickname,
        steamId: userEntity.steamId,
        role: userEntity.role,
        inventory: userEntity.inventory?.id,
    }));
  }

  @Mutation(() => UserGQL)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<UserGQL> {
    const userEntity = await this.usersService.create(createUserDto);
    return {
        id: userEntity.id,
        nickname: userEntity.nickname,
        steamId: userEntity.steamId,
        role: userEntity.role,
        inventory: userEntity.inventory?.id,
    };
  }
}