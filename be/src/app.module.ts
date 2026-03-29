import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloResolver } from './hello.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { Inventory } from './inventory/inventory.entity';
import { InventoryModule } from './inventory/inventory.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    InventoryModule,
    ProfileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..',  'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: false,
      migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
      entities: [User, Inventory],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, HelloResolver],
})

export class AppModule {}
