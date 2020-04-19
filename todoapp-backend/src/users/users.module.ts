import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { TodosModule } from 'src/todos/todos.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{
      name: 'Users',
      schema: UserSchema
    }]),
    TodosModule,
  ],
  exports: [UsersService]
})

export class UsersModule {
  configure(consumer: import('@nestjs/common').MiddlewareConsumer){
    consumer.apply().forRoutes(UsersController);
  }
}
