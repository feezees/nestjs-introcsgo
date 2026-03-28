import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../user.entity';
import { Inventory } from 'src/inventory/inventory.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  nickname: string;

  @Field(() => Number, { nullable: true })
  steamId?: number;

  @Field(() => String)
  role: UserRole;

  @Field(() => Int)
  inventory: number;
}