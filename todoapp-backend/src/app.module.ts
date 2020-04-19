import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './todos/taskmanager/tasks.module';
require('dotenv').config();

@Module({
  imports: [ScheduleModule.forRoot(),
    TasksModule,
    TodosModule,
    UsersModule,
  MongooseModule.forRoot(process.env.MONGOOSE_URL), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
