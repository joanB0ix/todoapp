import { Injectable, Logger} from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { TodosService } from '../todos.service';

@Injectable()
export class TaskManager{
    constructor(private readonly todosService: TodosService){}
    private readonly logger = new Logger(TaskManager.name);
    
    @Cron('0 */30 1-5 * * *')
    handleCron() {
      this.todosService.deleteChecked();
    }
}