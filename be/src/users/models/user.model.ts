import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  nickname: string;

  @Field(() => Number, { nullable: true })
  steamId?: number;
}