import { Module } from '@nestjs/common';
import { TaskManager } from './taskmanager';
import { TodosModule } from '../todos.module';

@Module({
    providers: [TaskManager],
    imports: [TodosModule]
})
export class TasksModule {}