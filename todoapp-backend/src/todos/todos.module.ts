import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoSchema } from './schemas/todo.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [TodosService],
  controllers: [TodosController],
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{
      name: 'Todos',
      schema: TodoSchema
    }])
  ],
  exports: [TodosService]
})

export class TodosModule {
  configure(consumer: import('@nestjs/common').MiddlewareConsumer){
    consumer.apply().forRoutes(TodosController);
  }
}
